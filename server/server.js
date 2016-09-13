var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port        = process.env.PORT || 8080; // SET PORT HERE
var host        = '192.168.0.32'; //SET HOST HERE '0.0.0.0'192.168.0.44
var jwt         = require('jwt-simple');
var Event = require('./app/models/event');
var Session = require('./app/models/session');
var Intervent = require('./app/models/intervent');
var bcryptjs = require('bcryptjs');

//MONGO CLIENT
/*
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
*/

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');//http://localhost:8100

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize());

// Start the server
app.listen(port, host);
console.log('There will be dragons: ' + host + ':' + port);

// connect to database
mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);
 
// bundle our routes
var apiRoutes = express.Router();
// connect the api routes under /api/*
app.use('/api', apiRoutes);

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
    console.log(req.body);
  if (!req.body.username || !req.body.password || !req.body.name || !req.body.surname || !req.body.email) {
    res.json({success: false, msg: 'Passaggio di parametri incompleto'});
  } else {
    var newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
                console.log(err);
        return res.json({success: false, msg: 'Username già esistente'});
      }
      res.json({success: true, msg: 'Nuovo utente creato con successo'});
    });
  }
});
 
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Autenticazione fallita, Utente non trovato'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Autenticazione fallita, Password non valida'});
        }
      });
    }
  });
});
 
// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.send({success: false, msg: 'Autenticazione fallita, Utente non trovato'});
        } else {
          res.json({success: true, data: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//NEW 

apiRoutes.get('/publicevents', function(req, res) {
    Event.find({
      public: true
    }, function(err, eventsArray) {
        if (err) throw err;
 
        if (!eventsArray) {
          return res.send({success: false, msg: 'Nessun evento pubblico trovato'});
        } 
        
        res.json({success: true, data: eventsArray});
    }).sort({startDate:-1});
});

apiRoutes.post('/sessions', function(req, res) {
    Session.find({
      event: req.body.event
    }, function(err, sessionsArray) {
        if (err) throw err;
 
        if (!sessionsArray) {
          return res.send({success: false, msg: 'Nessuna sessione trovata per questo Evento'});
        } 
        
        res.json({success: true, data: sessionsArray});
    }).sort({startDate:-1});
});

apiRoutes.post('/intervents', function(req, res) {

    Intervent.find({
      session: req.body.session
    }, function(err, interventsArray) {
        if (err) throw err;
 
        if (!interventsArray) {
          return res.send({success: false, msg: 'Nessun intervento trovato per questa Sessione'});
        } 
        
        res.json({success: true, data: interventsArray});
    }).sort({date:-1});
});

apiRoutes.get('/personalevents', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Event.find({
            organizer: decoded.username
        }, function(err, eventsArray) {
            if (err) throw err;

            if (!eventsArray) {
              return res.send({success: false, msg: 'Nessun evento per questo utente trovato'});
            } 

            res.json({success: true, data: eventsArray});
        }).sort({startDate:-1});
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});
apiRoutes.get('/observedevents', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            username: decoded.username
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
              return res.send({success: false, msg: 'Utente Non trovato'});
            } 
            
            Event.find({
                _id: {$in: user.observedEvents}
            }, function(err, eventsArray){
                if (err) throw err;

                if (!eventsArray) {
                  return res.send({success: false, msg: 'Errore nel recupero degli eventi osservati'});
                }
                res.json({success: true, data: eventsArray});
            }).sort({startDate:-1});
        });
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.get('/joinedevents', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            username: decoded.username
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
              return res.send({success: false, msg: 'Utente Non trovato'});
            } 
            Event.find({
                _id: {$in: user.joinedEvents}
            }, function(err, eventsArray){
                if (err) throw err;

                if (!eventsArray) {
                  return res.send({success: false, msg: 'Errore nel recupero degli eventi seguiti'});
                }
                res.json({success: true, data: eventsArray});
            }).sort({startDate:-1});
        });
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/createevent', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      if (!req.body.title || !req.body.startDate || !req.body.endDate || !req.body.location || !req.body.organizer || !req.body.status) {
        res.json({success: false, msg: 'Passaggio di parametri incompleto'});
      } else {
        var newEvent = new Event({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            location: req.body.location,
            status: req.body.status,
            organizer: req.body.organizer,
            public: true
        });
        newEvent.save(function(err) {
          if (err) {
            console.log(err);
            return res.json({success: false, msg: 'Errore di creazione Evento'});
          }
            res.json({success: true, msg: 'Nuovo evento creato con successo', id: newEvent._id});
        });
      }
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/createsession', function(req, res) {
    console.log(req.body);
    var token = getToken(req.headers);
    if (token) {
      if (!req.body.title || !req.body.startDate || !req.body.endDate || !req.body.speakers || !req.body.status || !req.body.event) {
        res.json({success: false, msg: 'Passaggio di parametri incompleto'});
      } else {
          Event.findOne({
            _id: req.body.event
          }, function(err, event) {
              if(err){
                  return res.json({success: false, msg: 'Errore di creazione Sessione, Nessun Evento trovato con ID ricevuto'});
              }
              var newSession = new Session({
                  title: req.body.title,
                  startDate: req.body.startDate,
                  endDate: req.body.endDate,
                  speakers: req.body.speakers,
                  status: req.body.status,
                  event: req.body.event
              });
              newSession.save(function(err) {
                  if (err) {
                    console.log(err);
                    return res.json({success: false, msg: 'Errore di creazione Sessione'});
                  } 
                    res.json({success: true, msg: 'Nuova sessione creata con successo', id: newSession._id});
                });
          });
      }
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/createintervent', function(req, res) {
    console.log(req.body);
    var token = getToken(req.headers);
    if (token) {
      if (!req.body.title || !req.body.date || !req.body.duration || !req.body.speaker || !req.body.session || !req.body.status) {
        res.json({success: false, msg: 'Passaggio di parametri incompleto'});
      } else {
          Session.findOne({
            _id: req.body.session
          }, function(err, session) {
              if(err){
                  return res.json({success: false, msg: 'Errore di creazione Intervento, Nessuna Sessione trovata con ID ricevuto'});
              }
              var newIntervent = new Intervent({
                  title: req.body.title,
                  date: req.body.date,
                  duration: req.body.duration,
                  speaker: req.body.speaker,
                  session: req.body.session,
                  status: req.body.status
              });
              newIntervent.save(function(err) {
                  if (err) {
                    console.log(err);
                    return res.json({success: false, msg: 'Errore di creazione Intervento'});
                  }
                  if(session.speakers.indexOf(req.body.speaker) == -1){//SE NON ESISTE GIA' UNO SPEAKER CON QUEL NOME 
                      //AGGIORNA GLI SPEAKER DELLA SESSIONE
                      Session.update({
                        _id: req.body.session
                      },{ $push: {
                          speakers: req.body.speaker
                      }}, {multi: false}, function(err, result) {
                          if (err) throw err;

                          if (!result) {
                            return res.json({success: false, msg: 'Errore di aggiornamento Sessione'});
                          } 
                      });
                  }
                  res.json({success: true, msg: 'Nuovo intervento creato con successo', id: newIntervent._id});
              });
          });
      }
    }else{
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/deleteintervent', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Intervent.findOne({
          _id: req.body.id
        }, function(err, intervent) {
            if (err) throw err;
            var sessionToUpdate = intervent.session;
            if (!intervent) {
              return res.send({success: false, msg: 'Eliminazione Intervento fallita'});
            } else {
                //CERCA LA SESSIONE
                Session.findOne({
                    _id: sessionToUpdate
                },function(err, session){
                    if (err) throw err;

                    if(!session){
                        return res.send({success: false, msg: 'Eliminazione Intervento fallita'});
                    }else{
                        //CERCA TUTTI GLI INTERVENTI PER LA SESSIONE
                        Intervent.find({
                            session: sessionToUpdate
                        }, function(err, intervents) {
                            if (err) throw err;

                            if(!intervents){
                                return res.send({success: false, msg: 'Eliminazione Intervento fallita'});
                            }else{
                                session.speakers=session.speakers[0];
                                intervents.forEach(function(singleIntervent) {
                                    if(singleIntervent._id!=intervent._id && session.speakers.indexOf(singleIntervent.speaker)==-1){
                                        session.speakers.push(singleIntervent.speaker);
                                    }
                                }, this);
                                session.save();
                            }
                        });
                    }
                });
                intervent.remove();
                res.json({success: true, msg: "Eliminazione Intervento eseguita"});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/deletesession', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Intervent.remove({
          session: req.body.id
        }, function(err, result) {
            if (err) throw err;

            if (!result) {
              return res.send({success: false, msg: 'Eliminazione Interventi della sessione fallita'});
            } else {
                Session.remove({
                    _id: req.body.id
                }, function(err, result){
                    if(err) throw err;
                    
                    if (!result) {
                        return res.send({success: false, msg: 'Eliminazione Sessione fallita'});
                    }else{
                        res.json({success: true, msg: "Eliminazione Sessione e relativi Interventi eseguita"});
                    }
                })
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});
apiRoutes.post('/deleteevent', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        //TROVA SESSIONI
        Session.find({
            event: req.body.id
        }, function(err, sessionsList){
            if (err) throw err;
            
            if(!sessionsList){
                return res.send({success: false, msg: 'Eliminazione Sessioni di questo evento fallita'});
            }else{
                //PER OGNI SESSIONE CANCELLA INTERVENTI
                sessionsList.forEach(function(currentSession){
                    //CANCELLA INTERVENTI DI CIASCUNA SESSIONE
                    Intervent.remove({
                      session: currentSession._id
                    }, function(err, result) {
                        if (err) throw err;

                        if (!result) {
                          return res.send({success: false, msg: 'Eliminazione Interventi delle sessioni di questo intervento fallita'});
                        }
                    });
                });
                //CANCELLA TUTTE LE SESSIONI DELL'EVENTO
                Session.remove({
                  event: req.body.id
                }, function(err, result) {
                    if (err) throw err;

                    if (!result) {
                      return res.send({success: false, msg: 'Eliminazione Sessioni di questo evento fallita'});
                    } else {
                        //CANCELLA EVENTI
                        Event.remove({
                            _id: req.body.id
                        }, function(err, result){
                            if(err) throw err;

                            if (!result) {
                                return res.send({success: false, msg: 'Eliminazione Evento fallita'});
                            }else{
                                res.json({success: true, msg: "Eliminazione Evento e relative Sessioni e Interventi eseguita"});
                            }
                        })
                    }
                });
            }
        })
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/updateevent', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        if (!req.body.title || !req.body.startDate || !req.body.endDate || !req.body.location || !req.body.id) {
            res.json({success: false, msg: 'Passaggio di parametri incompleto'});
        } else {
            Event.update({
            _id: req.body.id
            },{ $set: { 
                title: req.body.title,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                location: req.body.location
            }}, {multi: false}, function(err, result) {
                if (err) throw err;

                if (!result) {
                return res.send({success: false, msg: 'Aggiornamento evento fallito'});
                } else {
                    console.log(result);
                res.json({success: true, msg: "Aggiornamento evento eseguito"});
                }
            });
        }
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/updatesession', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        if (!req.body.title || !req.body.startDate || !req.body.endDate || !req.body.id) {
            res.json({success: false, msg: 'Passaggio di parametri incompleto'});
        } else {
            Session.update({
            _id: req.body.id
            },{ $set: { 
                title: req.body.title,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }}, {multi: false}, function(err, result) {
                if (err) throw err;

                if (!result) {
                return res.send({success: false, msg: 'Aggiornamento sessione fallito'});
                } else {
                res.json({success: true, msg: "Aggiornamento sessione eseguito"});
                }
            });
        }
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/updateintervent', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        if (!req.body.title || !req.body.date || !req.body.duration || !req.body.speaker || !req.body.id) {
            res.json({success: false, msg: 'Passaggio di parametri incompleto'});
        } else {
            Intervent.findOne({
                _id: req.body.id
            }, function(err, intervent) {
                if (err) throw err;

                if (!intervent) {
                    return res.send({success: false, msg: 'Aggiornamento intervento fallito'});
                } else {
                    intervent.title = req.body.title;
                    intervent.date = req.body.date;
                    intervent.duration = req.body.duration;
                    intervent.speaker = req.body.speaker;
                    
                    //CERCA LA SESSIONE
                    Session.findOne({
                        _id: intervent.session
                    },function(err, session){
                        if (err) throw err;

                        if(!session){
                            return res.send({success: false, msg: 'Aggiornamento intervento fallito'});
                        }else{
                            //CERCA TUTTI GLI INTERVENTI PER LA SESSIONE
                            Intervent.find({
                                session: intervent.session
                            }, function(err, intervents) {
                                if (err) throw err;
                                console.log(intervents);
                                if(!intervents){
                                    return res.send({success: false, msg: 'Aggiornamento intervento fallito'});
                                }else{
                                    session.speakers=session.speakers[0];
                                    intervents.forEach(function(singleIntervent) {
                                        if(singleIntervent._id!=intervent._id && session.speakers.indexOf(singleIntervent.speaker)==-1){
                                            session.speakers.push(singleIntervent.speaker);
                                        }
                                    }, this);
                                    if(session.speakers.indexOf(intervent.speaker)==-1){
                                        session.speakers.push(intervent.speaker);
                                    }
                                    session.save();
                                }
                            });
                        }
                    });
                    intervent.save();
                    res.json({success: true, msg: "Aggiornamento intervento eseguito"});
                }
            });  
        }
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/updateuser', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.update({
          _id: decoded._id
        },{ $set: { 
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email
        }}, {multi: false}, function(err, result) {
            if (err) throw err;

            if (!result) {
              return res.send({success: false, msg: 'Aggiornamento utente fallito'});
            } else {
              res.json({success: true, msg: "Aggiornamento utente eseguito"});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/updatepassword', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
    var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function(err, user) {
            if (err) throw err;
            
            if (!user) {
              return res.send({success: false, msg: 'Autenticazione fallita, Utente non trovato'});
            } else {
                bcryptjs.compare(req.body.oldPassword, user.password, function (err, isMatch) {
                    if (err) {
                        return res.send({success: false, msg: 'Errore nella comparazione della password'}); 
                    }
                    if(isMatch){
                        var newPassword;
                        bcryptjs.genSalt(10, function (err, salt) {
                            if (err) {
                                return (err);
                            }
                            bcryptjs.hash(req.body.newPassword, salt, function (err, hash) {

                                if (err) {
                                    return (err);
                                }
                                newPassword = hash;
                                console.log("ECCOLA NUOVA "+newPassword)
                                User.update({
                                  _id: decoded._id
                                },{ $set: { 
                                    password: newPassword,
                                }}, {multi: false}, function(err, result) {
                                    if (err) throw err;

                                    if (!result) {
                                      return res.send({success: false, msg: 'Aggiornamento fallito'});
                                    } else {
                                      res.json({success: true, msg: "Password Aggiornata"});
                                    }
                                });
                            });
                        });
                    }else{
                        return res.send({success: false, msg: 'Autenticazione fallita, Password errata'});
                    }
                    console.log("OK: "+isMatch);
                });
            }
        });
    } else {
        return res.send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/openserver', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        //DEPENDENCIES
        var server = require("http").Server(express);
        var io = require("socket.io")(server); 
        //TEST PORTS
        server.listen(0);
        //SAVE PORT IN INTERVENT
        Intervent.findOne({ _id: req.body.id }, function (err, intervent){
            if(err) throw err;
            
            intervent.status= 'ongoing';
            intervent.port= server.address().port;
            intervent.save();
            
            Session.findOne({ _id: intervent.session}, function (err, session){
                if(err) throw err;

                session.status= 'ongoing';
                session.save();

                Event.findOne({ _id: session.event }, function (err, event){
                    if(err) throw err;

                    event.status= 'ongoing';
                    event.save();
                });
            });
        });
        
        //LISTENER
        var allClients=[];
        var _transcription="";
        io.on('connection', function (socket) {
            console.log("User Connected");
            allClients.push(socket);
            
            socket.on('client_type',function(data){
                var msg="User Type: ";
                msg += data.text;
                if(data.text=='Listener'){
                    socket.emit('previous_text', {text: _transcription})
                }
                console.log(msg);
            });
            
            socket.on('client_message',function(data){
                console.log(new Date() + " " + data.text);
                _transcription += data.text + " ";
                socket.broadcast.emit('server_message',{text:data.text});
            });
            socket.on('client_question',function(data){
                console.log("QUESTION: "+data.text);
                allClients[0].emit('question', {text:data.text});
            });
            socket.on('close_room', function (data) {
                socket.broadcast.emit('closing_room', {text:"La stanza è stata Chiusa!" });
                //socket.disconnect();//HA LO STESSO EFFETTO DEL LATO CLIENT
                allClients.forEach(function(s) {
                    s.disconnect();
                });
                
                console.log("Room Disconnected");
                
                //RIAGGIORNA LO STATO DI INTERVENTO; SESSIONE ED EVENTO
                Intervent.findOne({ _id: req.body.id }, function (err, intervent){
                    if(err) throw err;

                    intervent.status= 'programmed';
                    intervent.save();

                    Session.findOne({ _id: intervent.session}, function (err, session){
                        if(err) throw err;

                        session.status= 'programmed';
                        session.save();

                        Event.findOne({ _id: session.event }, function (err, event){
                            if(err) throw err;

                            event.status= 'programmed';
                            event.save();

                        });
                    });
                });
                io.close();
            });
        });
        
        res.send({success: true, port: server.address().port});
    } else {
        return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
    }
});

apiRoutes.post('/addobservedevent', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.send({success: false, msg: 'Utente non trovato'});
        } else {
            if(user.observedEvents.indexOf(req.body.id) != -1){
                return res.send({success: false, msg: 'Evento già seguito'});
            }
            user.observedEvents.push(req.body.id);
            user.save();
            
          res.json({success: true, data: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});

apiRoutes.post('/removeobservedevent', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.send({success: false, msg: 'Utente non trovato'});
        } else {
            var index = user.observedEvents.indexOf(req.body.id);
            if(index == -1){
                return res.send({success: false, msg: 'Evento non presente tra quelli seguiti'});
            }
            user.observedEvents.splice(index, 1);
            user.save();
            
          res.json({success: true, data: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});

apiRoutes.post('/saveinterventtext', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Intervent.findOne({
      _id: req.body.id
    }, function(err, intervent) {
        if (err) throw err;
 
        if (!intervent) {
          return res.send({success: false, msg: 'Intervento non trovato'});
        } else {
            intervent.text=req.body.text;
            intervent.status="passed";
            intervent.save();
            
          res.json({success: true, data: intervent});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});

apiRoutes.post('/addjoinedevent', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.send({success: false, msg: 'Utente non trovato'});
        } else {
            if(user.joinedEvents.indexOf(req.body.id) != -1){
                return res.send({success: false, msg: 'Evento già ascoltato'});
            }
            user.joinedEvents.push(req.body.id);
            user.save();
            
          res.json({success: true, data: user, msg: "Evento aggiunto agli eventi seguiti"});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});

apiRoutes.post('/removejoinedevent', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.send({success: false, msg: 'Utente non trovato'});
        } else {
            var index = user.joinedEvents.indexOf(req.body.id);
            if(index == -1){
                return res.send({success: false, msg: 'Evento non presente tra quelli ascoltati'});
            }
            user.joinedEvents.splice(index, 1);
            user.save();
            
          res.json({success: true, data: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});

apiRoutes.post('/addquestion', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Intervent.findOne({
      _id: req.body.id
    }, function(err, intervent) {
        if (err) throw err;
 
        if (!intervent) {
          return res.send({success: false, msg: 'Intervento non trovato'});
        } else {
            intervent.questions.push(req.body.question);
            intervent.save();
            
            res.json({success: true, data: intervent});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Nessun token ricevuto'});
  }
});


