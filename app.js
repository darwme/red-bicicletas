const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const indexRouter = require('./routes/index');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const authAPIRouter = require('./routes/api/auth');
const tokenRouter = require('./routes/token');
const usuariosRouter = require('./routes/usuarios');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const session = require('express-session');
const addBicicleta = require('./routes/addBicicleta');
const Token = require('./models/token');
require('dotenv').config();

const mongoose = require('mongoose');
const { error } = require('console');
const usuario = require('./models/usuario');


const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(
  console,
  'MongoDB connection error:'
));

db.once('open', () => {
  console.log('Connected to MongoDB');
});


const store = new session.MemoryStore;
const app = express();

app.set(
  'secretKey',
  'jwt_pwd_!!223344'
);

app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 }, // 10 days
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!!!***!'
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res) {
  res.render('session/login');
});

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, usuario, info) {
    if (err) {
      console.log('EXISTE ERROR OJITO', err);
      return next(err);
    }
    if (!usuario) {
      console.log('EXISTE SIN USUARIO', err);
      return res.status(400).render('session/login', { info });
    }
    req.logIn(usuario, function (err) {
      if (err) return next(err);
      return res.status(200).redirect('/');
    });
  })(req, res, next);
});


app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log('Error logging out:', err);
      return res.redirect('/login');
    }
    console.log('Logged out');
    res.redirect('/');
  });
});




app.get('/forgotPassword', function (req, res) {
  console.log('forgotPassword, entrado al get');
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', async function (req, res, next) {
  console.log('forgotPassword en el post', req.body.email);
  try {
    const user = await usuario.findOne({ email: req.body.email });
    console.log('usuario', req.body.email);
    if (!user) {
      return res.render('session/forgotPassword', {
        info: { message: 'No existe el usuario' }
      });
    }
    await user.resetPassword();
    console.log('session/forgotPasswordMessage');
    res.render('session/forgotPasswordMessage');
  } catch (err) {
    next(err);
  }
});

app.get('/resetPassword/:token', async function (req, res, next) {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send({ type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado' });
    }
    const user = await usuario.findById(token._userId);
    if (!user) {
      return res.status(400).send({ msg: 'No existe un usuario asociado al token' });
    }
    res.render('session/resetPassword', { errors: {}, usuario: user });
  } catch (err) {
    next(err);
  }
});

app.post('/resetPassword', async function (req, res) {
  try {
    console.log('resetPassword dentro del post');
    if (req.body.password != req.body.confirm_password) {
      res.render('session/resetPassword', {
        errors: {
          confirm_password: {
            message: 'No coincide con el password ingresado'
          }
        },
        usuario: new usuario({
          email: req.body.email
        })
      });
      return;
    }
    const user = await usuario.findOne({
      email: req.body.email
    });
    user.password = req.body.password;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log('resetPassword dentro del catch, ERROR', err);
    res.render('session/resetPassword', {

      errors: err.errors, user: new usuario({
        email: req.body.email
      })
    });
  }
});

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log('jwt verify:', decoded);
      next();
    }
  });

}

app.get('/privacy', function (req, res) {
  res.render('privacy');
});

app.get('/about-service', function (req, res) {
  res.render('about-service');
});

app.use('/', indexRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/token', tokenRouter);
app.use('/usuarios', usuariosRouter);
app.use('/bicicleta', addBicicleta);




function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('Usuario sin loguearse');
    res.redirect('/login');
  }
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error';

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
