// App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handlePredictEmotions = async () => {
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setIsLoading(true);

      const response = await fetch('http://127.0.0.1:8000/api/predict_emotions/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emotions');
      }

      const data = await response.json();
      setEmotions(data.emotions);
    } catch (error) {
      console.error('Error predicting emotions:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Emotion Detector</h1>
      </div>
      <div className="main-content">
        <div className="image-container">
          <label className="image-label">
            <i className="fas fa-image"></i> Select an Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <button className="predict-button" onClick={handlePredictEmotions} disabled={isLoading}>
          {isLoading ? 'Predicting...' : 'Predict Emotions'}
        </button>
      </div>
      {emotions.length > 0 && (
        <div className="result-container">
          <div className="emotion-list">
            <h2>Emotions:</h2>
            <ul>
              {emotions.map((emotion, index) => (
                <li key={index}>{emotion}</li>
              ))}
            </ul>
          </div>
          <div className="emotion-count">
            <h2>Emotion Counts:</h2>
            <table>
              <thead>
                <tr>
                  <th>Emotion</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {/* Use a function to count occurrences of each emotion */}
                {Array.from(new Set(emotions)).map((uniqueEmotion) => (
                  <tr key={uniqueEmotion}>
                    <td>{uniqueEmotion}</td>
                    <td>{emotions.filter((e) => e === uniqueEmotion).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
