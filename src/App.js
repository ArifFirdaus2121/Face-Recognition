import React, { useState } from 'react';
import * as faceapi from 'face-api.js';

import image1 from './images/gaeul.jpg'; 
import image2 from './images/nako.jpg';

import image3 from './images/ghst1.jpg'; 
import image4 from './images/ghst2.jpg';

import image5 from './images/kucing1.jpg';
import image6 from './images/kucing2.jpg';

import image7 from './images/anj1.jpg';
import image8 from './images/anj2.jpg';

import image9 from './images/mkn1.jpg';
import image10 from './images/mkn2.jpeg';

import image11 from './images/bayi1.jpg';
import image12 from './images/bayi2.jpg';

import image13 from './images/bowo1.jpeg';
import image14 from './images/bowo2.jpeg';

function App() {
  const [expression, setExpression] = useState({});
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [showImages, setShowImages] = useState({
    image1: false,
    image2: false,
    image3: false,
    image4: false,
    image5: false,
    image6: false,
    image7: false,
    image8: false,
    image9: false,
    image10: false,
    image11: false,
    image12: false,
    image13: false,
    image14: false,
  }); 

  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef();

  const [hasExpressionChanged, setHasExpressionChanged] = useState(false);
  const [hasAlertShown, setHasAlertShown] = useState(false);


  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    loadModels();
  }, []);


  // React.useEffect(() => {
  //   let isMounted = true;
  
  //   // This effect runs when the expression state changes
  //   if (hasExpressionChanged) {
  //     const dominantEmotion = Object.keys(expression).reduce(
  //       (a, b) => (expression[a] > expression[b] ? a : b),
  //       ''
  //     );
  
  //     if (isMounted) {
  //       alert(dominantEmotion);  // Show the alert
  //       // Set hasExpressionChanged to false to prevent further alerts
  //       setHasExpressionChanged(false);
  //     }
  //   }
  
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [expression, hasExpressionChanged]);

  let detectionTimeout;
  
  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });

  };

  // Determine the dominant emotion
  const dominantEmotion = Object.keys(expression).reduce(
    (a, b) => (expression[a] > expression[b] ? a : b),
    ''
  );

  const handleVideoOnPlay = () => {
    detectionTimeout = setTimeout(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          setExpression(detections[0].expressions);

          setHasExpressionChanged(true);  // Signal that the expression has changed
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          // alert(dominantEmotion);

          canvasRef &&
            canvasRef.current &&
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
          canvasRef &&
            canvasRef.current &&
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          canvasRef &&
            canvasRef.current &&
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          canvasRef &&
            canvasRef.current &&
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        } else {
          setExpression({});
        }
        setHasExpressionChanged(true); 
      }
    }, 1000);
  };
  const handleVideoOnPlayReal = async () => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        setExpression(detections[0].expressions);

        setHasExpressionChanged(true);  // Signal that the expression has changed

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        // alert(dominantEmotion);
        // setHasAlertShown(true);

        canvasRef &&
          canvasRef.current &&
          canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      } else {
        setExpression({});
        setHasAlertShown(false); 
      }
    }
    detectionTimeout = setTimeout(handleVideoOnPlayReal, 100); // Adjust the timeout interval as needed
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
    setShowImages({
      image1: false,
      image2: false,
      image3: false,
      image4: false,
      image5: false,
      image6: false,
      image7: false,
      image8: false,
      image9: false,
      image10: false,
      image11: false,
      image12: false,
      image13: false,
      image14: false,
    });
  };

 

  const toggleImages = () => {
    clearTimeout(detectionTimeout);
  
    // Check if the webcam is closed
    if (!captureVideo) {
      // Reset showImages state
      setShowImages({
        image1: false,
        image2: false,
        image3: false,
        image4: false,
        image5: false,
        image6: false,
        image7: false,
        image8: false,
        image9: false,
        image10: false,
        image11: false,
        image12: false,
        image13: false,
        image14: false,
      });
      return;
    }
  
    
  
    // Show images based on the dominant emotion
    setShowImages((prevImages) => ({
      image1: dominantEmotion === 'happy',
      image2: dominantEmotion === 'happy',
      image3: dominantEmotion === 'sad',
      image4: dominantEmotion === 'sad',
      image5: dominantEmotion === 'angry',
      image6: dominantEmotion === 'angry',
      image7: dominantEmotion === 'fearful',
      image8: dominantEmotion === 'fearful',
      image9: dominantEmotion === 'disgusted',
      image10: dominantEmotion === 'disgusted',
      image11: dominantEmotion === 'surprised',
      image12: dominantEmotion === 'surprised',
      image13: dominantEmotion === 'neutral',
      image14: dominantEmotion === 'neutral',
    }));
  
    // Start the appropriate video handling function
    if (
      dominantEmotion === 'happy' ||
      dominantEmotion === 'angry' ||
      dominantEmotion === 'fearful' ||
      dominantEmotion === 'disgusted' ||
      dominantEmotion === 'surprised' ||
      dominantEmotion === 'neutral'
    ) {
      handleVideoOnPlayReal();
    } else {
      handleVideoOnPlay();
    }
  };
  
  
  
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {captureVideo && modelsLoaded ? (
          <>
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Tutup Kamera
            </button>
          </>
        ) : (
          <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
            Buka Kamera
          </button>
        )}
         <button onClick={toggleImages} style={{ marginLeft: '10px', cursor: 'pointer', backgroundColor: 'orange', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Tampilkan Gambar
            </button>
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px', transform: 'scaleX(-1)' }} />
              <canvas ref={canvasRef} style={{ position: 'absolute', display: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
              <div style={{ textAlign: 'center' }}>Parameter :</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                {Object.entries(expression).map(([emotion, value]) => (
                    <div key={emotion} style={{ marginLeft: '10px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '100px',
                          height: '20px',
                          backgroundColor: value > 0.70 ? 'green' : 'red',
                          color: 'white',
                          textAlign: 'center',
                          borderRadius: '5px',
                        }}
                      >
                        {`${Math.round(value * 100)}%`}
                      </span>
                      <br />
                      {getEmotionTextInIndonesian(emotion, value > 0.70 ? 'green' : 'red')}
                    </div>
                  ))}
              </div>
              {showImages.image1 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image1 && <img src={image1} alt="Image 1" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image2 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image2 && <img src={image2} alt="Image 2" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image3 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image3 && <img src={image3} alt="Image 3" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image4 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image4 && <img src={image4} alt="Image 4" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image5 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image5 && <img src={image5} alt="Image 5" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image6 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image6 && <img src={image6} alt="Image 6" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image7 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image7 && <img src={image7} alt="Image 8" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image8 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image8 && <img src={image8} alt="Image 8" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image9 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image9 && <img src={image9} alt="Image 9" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image10 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image10 && <img src={image10} alt="Image 10" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image11 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image11 && <img src={image11} alt="Image 11" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image12 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image12 && <img src={image12} alt="Image 12" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
              {showImages.image13 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image13 && <img src={image13} alt="Image 13" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}

              {showImages.image14 && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  </div>
                  {showImages.image14 && <img src={image14} alt="Image 14" style={{ width: '500px', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

function getEmotionTextInIndonesian(emotion, backgroundColor) {
  switch (emotion) {
    case 'neutral':
      if (backgroundColor === 'green') {
        // alert("Hello Netral!");
        return 'Netral. Anda mungkin sedang dalam keadaan stabil dan tenang. Saran: Tetap pertahankan keseimbangan dan jangan terlalu khawatir.';
      }
      break;
    case 'angry':
      if (backgroundColor === 'green') {
        // alert("Hello Angry!");
        return 'Marah. Anda mungkin mengalami tingkat stres yang tinggi atau merasa terprovokasi. Saran: Cobalah untuk bernapas dalam-dalam dan mencari cara untuk mengatasi sumber ketegangan.';
      }
      break;
    case 'disgusted':
      if (backgroundColor === 'green') {
        // alert("Hello disgusted!");
        return 'Jijik. Anda mungkin merasa tidak nyaman atau terganggu oleh sesuatu. Saran: Identifikasi penyebabnya dan pertimbangkan untuk menghindari atau mengatasi faktor tersebut.';
      }
      break;
    case 'fearful':
      if (backgroundColor === 'green') {
        // alert("Hello fearful!");
        return 'Takut. Mungkin Anda sedang menghadapi situasi yang menakutkan atau menimbulkan kecemasan. Saran: Berbicara dengan seseorang yang dapat memberikan dukungan, dan pertimbangkan untuk mencari solusi atas ketakutan Anda.';
      }
      break;
    case 'happy':
      if (backgroundColor === 'green') {
        // alert("Hello happy!");
        return 'Senang. Anda mungkin merasa bahagia atau puas dengan situasi saat ini. Saran: Teruskan pola hidup sehat dan pertahankan hubungan positif dengan orang di sekitar Anda.';
      }
      break;
    case 'sad':
      if (backgroundColor === 'green') {
        // alert("Hello sad!");
        return 'Sedih. Anda mungkin sedang mengalami kesedihan atau kekecewaan. Saran: Jangan ragu untuk mencari dukungan dari teman, keluarga, atau seorang profesional untuk membicarakan perasaan Anda.';
      }
      break;
    case 'surprised':
      if (backgroundColor === 'green') {
        // alert("Hello surprised!");
        return 'Terkejut. Mungkin Anda baru saja mengalami kejutan atau situasi yang tidak terduga. Saran: Evaluasi perasaan Anda dan cari tahu bagaimana Anda dapat menanggapi peristiwa tersebut secara positif.';
      }
      break;
    default:
      return emotion;
  }
}

export default App;
