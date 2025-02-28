'use client';
import React from 'react';
import MeetingTypeList from "@/components/MeetingTypeList";
import Clock from 'react-live-clock';

const Home = () => {
  const now = new Date();
  const currentDate = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(now));

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-end px-5 py-7 md:px-5 md:py-8 lg:p-11'>
          <div className='flex flex-col gap-2'>
            <Clock
              className='text-4xl font-extrabold lg:text-7xl'
              format={'HH:mm:ss'}
              ticking={true}
            />
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{currentDate}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList/>
    </section>
  );
};

export default Home;
