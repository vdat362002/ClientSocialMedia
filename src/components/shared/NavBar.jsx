import { HomeOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { lazy, Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { withAuth, withTheme } from '../../components/hoc';
import { LogoutModal, Messages, Notification } from '../../components/main';
import { Avatar, Loader, SearchInput, ThemeToggler } from '../../components/shared';
import { LOGIN, REGISTER } from '../../constants/routes';
import { useFileHandler, useModal } from '../../hooks';
import logo from '../../images/LogoSocialMedia.png';
import { FileImageFilled } from '@ant-design/icons';
import { logoutStart, updateAuthBackground } from '../../redux/action/authActions';
import CropBackgroundModal from '../main/Modals/CropBackgroundModal';
import { toast } from 'react-toastify';
import { uploadPhoto } from '../../services/api';
import { updateBackground } from '../../redux/action/profileActions';

const NavBarMobile = lazy(() => import('./NavBarMobile'));

const initImageState = { id: '', file: null, url: '' };

const NavBar = ({ isAuth, theme }) => {
  const dispatch = useDispatch();
  const { isLoadingAuth, auth, error } = useSelector((state) => ({
    isLoadingAuth: state.loading.isLoadingAuth,
    auth: state.auth,
    error: state.error.authError
  }));
  const [isUploadingBackgroundImage, setIsUploadingBackgroundImage] = useState(false);
  const logoutModal = useModal();
  const { pathname } = useLocation();
  const { isOpen, openModal, closeModal } = useModal();
  const backgroundPicture = useFileHandler('single', initImageState);
  const isLaptop = window.screen.width >= 1024;

  const onLogout = () => {
    dispatch(logoutStart(logoutModal.closeModal));
  };

  const handleBackgroundFileChange = (e) => {
    backgroundPicture.onFileChange(e, () => {
      openModal();
    });
  };

  const onCropSuccessCallback = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setIsUploadingBackgroundImage(true);
      toast('Uploading...', { hideProgressBar: true, bodyStyle: { color: '#1a1a1a' } });

      const { image } = await uploadPhoto(formData, 'background');

      dispatch(updateBackground(image));
      dispatch(updateAuthBackground(image));
      setIsUploadingBackgroundImage(false);

      toast.dismiss();
      toast.dark('Background picture successfully changed.', { hideProgressBar: true });
    } catch (e) {
      console.log(e);
      setIsUploadingBackgroundImage(false);
      toast.error(e.error.message);
    }
  };

  const hideNavToPaths = [LOGIN, REGISTER];

  return hideNavToPaths.includes(pathname) ? null : (
    <>
      {isLaptop ? (
        <nav className='contain flex justify-between items-center z-9999 border-b border-transparent dark:border-gray-900 align-center w-100 bg-white text-gray-700 h-60px py-2 fixed w-full shadow-md laptop:shadow-sm dark:bg-indigo-1000'>
          <div className='flex items-center space-x-8'>
            {/* ---- LOGO -------- */}
            <Link
              to={{
                pathname: '/',
                state: { from: pathname }
              }}>
              <img
                src={logo}
                alt=''
                className='w-8'
                style={{ filter: `brightness(${theme === 'dark' ? 3.5 : 1})` }}
              />
            </Link>
            {/* -------- SEARCH BAR ------- */}
            <SearchInput />
          </div>
          <div className='flex items-center space-x-16'>
            <NavLink
              className='flex items-center justify-center w-12 h-12 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100'
              title='Home'
              to='/'>
              <HomeOutlined />
            </NavLink>
            <NavLink
              className='flex items-center justify-center w-12 h-12 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100'
              title='Watch'
              to='/watch'>
              <VideoCameraOutlined />
            </NavLink>
          </div>
          <div className='hidden laptop:flex laptop:items-center space-x-2'>
            {isAuth ? (
              <>
                {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                <ul className='flex items-center space-x-16 mr-8'>
                  <li className='flex items-center justify-center w-12 h-12 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100'>
                    <Messages isAuth={isAuth} />
                  </li>
                  <li className='flex items-center justify-center w-12 h-12 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-indigo-1100'>
                    <Notification isAuth={isAuth} />
                  </li>
                </ul>
                <div className='flex items-center'>
                  {/* ---- AVATAR WITH  USERNAME ----------- */}
                  <Link to={`/user/${auth.username}`} className='cursor-pointer'>
                    <div className='flex items-center'>
                      <Avatar url={auth.profilePicture?.url} className='mr-2' />
                      <h6 className='text-sm mr-10 dark:text-indigo-400'>
                        {auth?.fullname ? auth.fullname : auth?.username}
                      </h6>
                    </div>
                  </Link>
                  {/* ----- LOGOUT BUTTON ------ */}
                  <button
                    className='button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-900 dark:hover:text-white dark:active:bg-indigo-1100'
                    onClick={logoutModal.openModal}
                    disabled={isLoadingAuth}>
                    Logout
                  </button>
                  {/* ----- CHANGE BACKGROUND BUTTON ------ */}
                  <CropBackgroundModal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    openModal={openModal}
                    file={backgroundPicture.imageFile}
                    onCropSuccessCallback={onCropSuccessCallback}
                  />
                  <input
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={handleBackgroundFileChange}
                    readOnly={isUploadingBackgroundImage}
                    id='background'
                  />
                  <label htmlFor='background'>
                    <div className='ml-2 button--muted !rounded-full dark:bg-indigo-1100 cursor-pointer dark:text-white dark:hover:bg-indigo-900 dark:hover:text-white dark:active:bg-indigo-1100'>
                      {isUploadingBackgroundImage ? (
                        <div className='w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                          <Loader mode='light' />
                        </div>
                      ) : (
                        <FileImageFilled />
                      )}
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <ul className='flex items-center'>
                <li className='group inline-block mx-3'>
                  <NavLink
                    to='/login'
                    className='group-hover:text-indigo-600 text-gray-500 dark:hover:text-white'
                    activeClassName='nav-active'>
                    Login
                  </NavLink>
                </li>
                <li className='group inline-block mx-3'>
                  <NavLink
                    to='/register'
                    className='button py-1 group-hover:text-indigo-600'
                    activeClassName='nav-active'>
                    Register
                  </NavLink>
                </li>
              </ul>
            )}
            <ThemeToggler />
          </div>
        </nav>
      ) : (
        <Suspense fallback={<nav className='bg-white h-60px fixed top-0 left-0 w-full shadow-md'></nav>}>
          <NavBarMobile isAuth={isAuth} theme={theme} auth={auth} openModal={logoutModal.openModal} />
        </Suspense>
      )}
      {logoutModal.isOpen && (
        <LogoutModal
          isOpen={logoutModal.isOpen}
          closeModal={logoutModal.closeModal}
          openModal={logoutModal.openModal}
          dispatchLogout={onLogout}
          error={error}
          isLoggingOut={isLoadingAuth}
        />
      )}
    </>
  );
};

export default withTheme(withAuth(NavBar));
