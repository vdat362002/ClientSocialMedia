import { createBrowserHistory } from 'history';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chats } from './components/main';
import { NavBar, Preloader } from './components/shared';
import * as ROUTE from './constants/routes';
import * as pages from './pages';
import { ProtectedRoute, PublicRoute } from './routers';
import { loginSuccess } from './redux/action/authActions';
import { checkAuthSession } from './services/api';
import socket from './socket/socket';
import Chatbot from './components/main/ChatBot/ChatBot';

export const history = createBrowserHistory();

function App() {
  const [isCheckingSession, setCheckingSession] = useState(true);
  const [dataAuth, setDataAuth] = useState();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isNotMobile = window.screen.width >= 800;

  useEffect(() => {
    (async () => {
      const { auth } = await checkAuthSession();
      setDataAuth(auth);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { auth } = await checkAuthSession();
        console.log('auth', auth);
        dispatch(loginSuccess(auth));

        socket.on('connect', () => {
          socket.emit('userConnect', auth.id);
          socket.emit('userStatus', { userId: auth.id, status: 'online' });
          socket.emit('userOnline', { userId: auth.id });
          console.log('Client connected to socket.');
        });

        // Try to reconnect again
        socket.on('error', function () {
          socket.emit('userConnect', auth.id);
        });

        socket.on('disconnect', () => {
          // Xử lý khi người dùng thoát khỏi trang
          socket.emit('userStatus', { userId: socket.id, status: 'offline' });
        });

        setCheckingSession(false);
      } catch (e) {
        console.log('ERROR', e);
        setCheckingSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAuth]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      const auth = dataAuth;
      const user_id = auth.id;
      socket.emit('updateStatus', { user_id });
      // Các công việc khác...

      // Cleanup: Hủy đăng ký sự kiện khi component unmount
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  }, [dataAuth]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        // Tab đang được đóng, thực hiện các công việc cần thiết
        const auth = dataAuth;
        const user_id = auth.id;
        socket.emit('updateStatus', { user_id });
        // Các công việc khác...
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Cleanup khi component unmount
  }, [dataAuth]);

  return isCheckingSession ? (
    <Preloader />
  ) : (
    <Router history={history}>
      <main
        className='relative min-h-screen'
        style={{
          backgroundImage: `url(${auth?.background?.url || ''})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          transition={Slide}
          draggable={false}
          hideProgressBar={true}
          bodyStyle={{ paddingLeft: '15px' }}
          style={{ zIndex: 99999 }}
        />
        <NavBar />
        <Switch>
          <PublicRoute path={ROUTE.REGISTER} component={pages.Register} />
          <PublicRoute path={ROUTE.LOGIN} component={pages.Login} />
          <ProtectedRoute path={ROUTE.SEARCH} component={pages.Search} />
          <Route path={ROUTE.HOME} exact render={(props) => <pages.Home key={Date.now()} {...props} />} />
          <Route path={ROUTE.WATCH} exact render={(props) => <pages.Watch key={Date.now()} {...props} />} />
          <Route path={ROUTE.FORGOTPASSWORD} component={pages.ForgotPassword} />
          <ProtectedRoute path={ROUTE.POST} component={pages.Post} />
          <ProtectedRoute path={ROUTE.PROFILE} component={pages.Profile} />
          <ProtectedRoute path={ROUTE.CHAT} component={pages.Chat} />
          <ProtectedRoute path={ROUTE.SUGGESTED_PEOPLE} component={pages.SuggestedPeople} />
          <Route path={ROUTE.SOCIAL_AUTH_FAILED} component={pages.SocialAuthFailed} />
          <Route component={pages.PageNotFound} />
        </Switch>
        {isNotMobile && <Chats />}
        <Chatbot />
      </main>
    </Router>
  );
}

export default App;
