'use client';
import React, {useState} from "react";
import HomeCard from "@/components/HomeCard";
import {useRouter} from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import {useUser} from "@clerk/nextjs";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useToast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Input} from "@/components/ui/input";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const {user} = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    link: '',
    description: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const {toast} = useToast()

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create a call');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        }
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({title: "Meeting created"})
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create a meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        className='bg-orange-1'
        img='/icons/add-meeting.svg'
        title='New meeting'
        description='Start an instant meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        className='bg-blue-1'
        img='/icons/schedule.svg'
        title='Schedule meeting'
        description='Plan a meeting'
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        className='bg-purple-1'
        img='/icons/recordings.svg'
        title='View recordings'
        description='Check out your recordings'
        handleClick={() => router.push('/recordings')}
      />
      <HomeCard
        className='bg-yellow-1'
        img='/icons/join-meeting.svg'
        title='Join meeting'
        description='Via invitation link'
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Create meeting'
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal-leading-[22px] text-sky-2'>Add a description</label>
            <Textarea
              onChange={(e) => setValues({...values, description: e.target.value})}
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base text-normal-leading-[22px] text-sky-2'>Select date and time</label>
            <DatePicker
              selected={values.dateTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              onChange={(date: Date) => setValues({...values, dateTime: date!})}
              className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
      ) : <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Meeting created'
        className='text-center'
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({title: 'Link copied to clipboard'});
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='Copy meeting link'
      />}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an instant meeting'
        className='text-center'
        buttonText='Start meeting'
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Paste the link of the meeting'
        className='text-center'
        buttonText='Join meeting'
        handleClick={() => router.push(values.link)}
      >
        <Input
          onChange={(e) => setValues({...values, link: e.target.value})}
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          placeholder='Meeting link'/>
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
