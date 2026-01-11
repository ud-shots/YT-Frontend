import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './src/components/Layout';
import Dashboard from './src/pages/Dashboard';
import UploadPage from './src/pages/Upload';
import VideoDetails from './src/pages/VideoDetails';
import Login from './src/pages/Login';
import SecureRoutes from './src/SecureRoutes/SecureRoutes';
import TokenExpiry from './src/pages/TokenExpiry';

const App = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<Layout />}>

    //   </Route>
    // </Routes>

    <Routes>
      <Route path='/sign-in' element={<Login />} />
      {/* <Route index element={<Home />} /> */}

      <Route path='/' element={<SecureRoutes />} >
        <Route path='/' element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path='/token-expiry' element={<TokenExpiry />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="video/:id" element={<VideoDetails />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default App;