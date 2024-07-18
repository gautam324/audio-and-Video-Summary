import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, CircularProgress, makeStyles } from '@material-ui/core';
import './styles/App.css';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  resultContainer: {
    marginTop: theme.spacing(4),
    textAlign: 'left',
  },
}));

function App() {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({ text: '', summary: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setLoading(false);
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h3" gutterBottom>Audio and Video Summarization</Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="audio/*,video/*"
          className={classes.input}
          id="contained-button-file"
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload File
          </Button>
        </label>
        <Typography variant="body2" color="textSecondary" style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        Supported formats: audio, video (mp4,avi,mov,mpeg,wav)
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload and Summarize'}
        </Button>
      </form>
      {loading && <CircularProgress className={classes.button} />}
      {result.text && (
        <div className={classes.resultContainer}>
          <Typography variant="h5" gutterBottom>Original Text</Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={result.text}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <Typography variant="h5" gutterBottom>Summary</Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={result.summary}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
        </div>
      )}
    </Container>
  );
}

export default App;
