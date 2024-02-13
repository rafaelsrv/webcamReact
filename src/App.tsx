import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import * as faceapi from 'face-api.js';
import { translateExpressionToEmoji } from './lib/utils';
import ResultMessage from './components/ResultMessage';

function App() {
  const [expression, setExpression] = useState('')
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log(videoRef.current)
 
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
      const videoEl = videoRef.current;
      if(videoEl){
        videoEl.srcObject = stream;
        
      }
    })
    
  },[])

  useEffect(() => {
    Promise.all([
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
    ]).then(()=>{
      console.log('Models Loaded')
    })
    
  }, []);


  async function handleLoadMetaData(){
    const canvasEl = canvasRef.current as HTMLCanvasElement;
    const videoEl = videoRef.current as HTMLVideoElement;
    if(!videoEl || !canvasEl) return;


    const detection = await faceapi.detectSingleFace(
      videoEl as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceExpressions();
    

    if(detection){
      
      
      const dominantExpression = detection.expressions.asSortedArray()[0]
      setExpression(dominantExpression.expression)
      
      
      const dimensions ={
        width: videoEl?.offsetWidth,
        height: videoEl?.offsetHeight,
      };
     
     faceapi.matchDimensions(canvasEl, dimensions)
     const resizedResults = faceapi.resizeResults(detection, dimensions);
     faceapi.draw.drawDetections(canvasEl, resizedResults);
    //  faceapi.draw.drawFaceLandmarks(canvasEl, resizedResults);
     faceapi.draw.drawFaceExpressions(canvasEl,resizedResults);
     setLoading(false)
     };
     setTimeout(handleLoadMetaData, 1000)
    }
  

  return (
    <main className="min-h-screen  flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
      <Header />
      <section className="flex flex-col gap-6 flex-1 w-full">
        <div className="bg-white rounded-xl p-2">
          <div className="relative flex items-center justify-center aspect-video w-full">
            <div className="aspect-video rounded-lg bg-gray-300 w-full">
              <div className='relative flex items-center justify-center w-full aspect-video'>
                <video onLoadedMetadata={handleLoadMetaData} autoPlay ref={videoRef} className='rounded w-full' ></video>
                <canvas ref={canvasRef} className='absolute inset-0 w-full h-full'></canvas>
              </div>
            
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-xl px-8 py-6 flex gap-6 lg:gap-20 items-center h-[200px] ${loading ? 'justify-center': 'justify-between'}`}
        >
            
            {loading ? 
            <div className='text-6xl text-amber-300 items-center'>
              <LoadingSpinner/>
            </div>
             : (
              <>
              <span className='lg:text-[100px] text-6xl'>{expression && translateExpressionToEmoji(expression)}</span>
              <h3 className='text-xl text-right lg:text-4xl md:text-3xl text-neutral-500 font-secondary'>
              <ResultMessage expression={expression}/>
              </h3>
              </>
            )}

           
            
          
        </div>
      </section>
    </main>
  );
}

export default App;
