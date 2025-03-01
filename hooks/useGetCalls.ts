import {useEffect, useState} from "react";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useUser} from "@clerk/nextjs";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(false)
  const {user} = useUser();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!client || !user) return;


      try {
        setIsLoading(true);
        const {calls} = await client.queryCalls(
          {
            sort: [{field: 'starts_at', direction: -1}],
            filter_conditions: {
              starts_at: {$exists: true},
              $or: [
                {created_by_user_id: user.id},
                {members: {$in: [user.id]}}
              ]
            }
          });

        setCalls(calls);
        setIsLoading(false);

      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }

    fetchCalls();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = calls.filter(({state: {startsAt, endedAt}}: Call) => {
    return (startsAt && new Date(startsAt) < now || !!endedAt)
  });

  const upcomingCalls = calls.filter(({state: {startsAt, endedAt}}: Call) => {
    return startsAt && new Date(startsAt) > now;
  });


  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading
  }
}
