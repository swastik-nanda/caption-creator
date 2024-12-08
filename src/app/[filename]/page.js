'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { clearTranscriptionItems } from '../lib/awsTranscriptionHelpers';
import TranscriptionItem from '../components/TranscriptionItem';
import SparklesIcon from '../components/SparklesIcon';

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState(
    []
  );
  useEffect(() => {
    getTranscription();
  }, [fileName]);

  function getTranscription() {
    setIsFetching(true);
    axios
      .get(`/api/transcribe?filename=${fileName}`)
      .then((response) => {
        setIsFetching(false);
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status === 'IN_PROGRESS') {
          setIsTranscribing(true);
          setTimeout(getTranscription, 3000);
        } else {
          setIsTranscribing(false);

          setAwsTranscriptionItems(
            clearTranscriptionItems(transcription.results.items)
          );
        }
      });
  }

  if (isTranscribing) {
    return <div>Transcribing your video...</div>;
  }
  if (isFetching) {
    return <div>Fetching info...</div>;
  }
  return (
    <div>
      <div className="grid grid-cols-2 gap-20">
        <div className="">
          <h2 className="text-2xl mb-4 text-white/60">
            Transcription
          </h2>
          <div className="grid grid-cols-3 sticky top-0 bg-violet-800/80 p-2 rounded-md">
            <div>Start</div>
            <div>End</div>
            <div>Captions</div>
          </div>
          {awsTranscriptionItems.length > 0 &&
            awsTranscriptionItems.map((el) => {
              return <TranscriptionItem el={el}></TranscriptionItem>;
            })}
        </div>
        <div className="">
          <h2 className="text-2xl mb-4 text-white/60">Result</h2>
          <div className="mb-4">
            <button className="bg-green-600 border-2 border-purple-700/50 py-2 px-6 rounded-full inline-flex gap-2 cursor-pointer">
              <SparklesIcon></SparklesIcon>
              <span>Apply Captions</span>
            </button>
          </div>
          <div className="rounded-xl overflow-hidden">
            <video
              controls
              src={
                'https://swastik-caption-bucket.s3.amazonaws.com/' +
                fileName
              }
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}
