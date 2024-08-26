import { useMount } from 'ahooks';
import { useState } from 'react';


export default function App() {
  const [source, setSource] = useState<string | null>(null);
  useMount(() => {
    const res = toolify.getScreenSource()
    console.log(res);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.close();
      }
    })
    setSource(res);
  });
  return (
    <div>
      <img src={source} className='screenshot-image' />
    </div>
  );
}
