/**
 * Page chrome for the booking-management screens: centred card on the site background.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ShellProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
}

const ManageShell: React.FC<ShellProps> = ({ children, theme }) => {
  const isLight = theme === 'light';
  return (
    <div
      className={`min-h-[calc(100vh-200px)] py-12 px-[25px] sm:px-8 ${isLight ? 'bg-[#F6F6F6]' : 'bg-[#0F0E22]'}`}
    >
      {/*
        The manage link carries the booking id + token in the URL. Suppress the
        Referer entirely on this page so the token never leaks to any resource
        the page loads.
      */}
      <Helmet>
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <div className="mx-auto max-w-[640px]">{children}</div>
    </div>
  );
};

export default ManageShell;
