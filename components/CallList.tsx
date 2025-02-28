// @ts-nocheck
'use client';
import {useGetCalls} from "@/hooks/useGetCalls";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {CallRecording} from "@stream-io/video-client";
import {Call} from "@stream-io/video-react-sdk";
import MeetingCard from "@/components/MeetingCard";
import Loader from "@/components/Loader";
import {useToast} from "@/components/ui/use-toast";

type CallListTypes = 'ended' | 'upcoming' | 'recordings';

const CallList = ({type}: { type: CallListTypes }) => {
  const toast = useToast();
  const router = useRouter();
  const {endedCalls, upcomingCalls, callRecordings, isLoading} = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings.map(meeting => meeting.queryRecordings()))
        const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);
        setRecordings(recordings);
      } catch (error) {
        toast({title: 'Try again later!'});
      }
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls();

  if (isLoading) return <Loader/>

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls.map((meeting: Call | CallRecording) => (
        <MeetingCard
          key={meeting?.id}
          icon={
            type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'
          }
          title={meeting.state?.custom?.description?.substring(0, 26) || meeting?.filename?.substring(0, 26) || 'Personal meeting'}
          date={meeting.state?.startsAt?.toLocaleString() || meeting.start_time.toLocaleString()}
          isPreviousMeeting={type === 'ended'}
          buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
          buttonText={type === 'recordings' ? 'Play' : 'Start'}
          link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
          handleClick={type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
        />
      ))}
    </div>
  );
};

export default CallList;
