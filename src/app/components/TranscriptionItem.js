import { useState } from 'react';

export default function TranscriptionItem({ el }) {
  const [startSec, setStartSec] = useState(el.start_time);
  const [endSec, setEndSec] = useState(el.end_time);
  const [content, setContent] = useState(el.content);
  return (
    <div className="my-1 flex gap-1 items-center grid grid-cols-3">
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={startSec}
        onChange={(ev) => setStartSec(ev.target.value)}
      ></input>
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={endSec}
        onChange={(ev) => setEndSec(ev.target.value)}
      ></input>
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      ></input>
    </div>
  );
}
