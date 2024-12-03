'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState(
    []
  );
  useEffect(() => {
    getTranscription();
  }, [fileName]);

  function getTranscription() {
    axios
      .get(`/api/transcribe?filename=${fileName}`)
      .then((response) => {
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status === 'IN_PROGRESS') {
          setIsTranscribing(true);
          setTimeout(getTranscription, 3000);
        } else {
          setIsTranscribing(false);
          console.log(transcription);
          setAwsTranscriptionItems(transcription.results.items);
        }
      });
  }
  return (
    <div>
      {fileName}
      <div>is Transcribing: {JSON.stringify(isTranscribing)}</div>
      {awsTranscriptionItems.length > 0 &&
        awsTranscriptionItems.map((el) => {
          return (
            <div>
              <span className="text-white/50 mr-2">
                {el.start_time} - {el.end_time}
              </span>
              <span>{el.alternatives[0].content}</span>
            </div>
          );
        })}
    </div>
  );
}
