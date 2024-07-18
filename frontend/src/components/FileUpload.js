import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Grid, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const FileUpload = () => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setText(response.data.text);
      setSummary(response.data.summary);
      setError('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <Container>
      <Grid container className={classes.formContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Voice and Video Chat Summary</Typography>
        </Grid>
        <Grid item xs={12}>
          <input
            accept=".txt,.pdf"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Upload File
            </Button>
          </label>
        </Grid>
        <Grid item xs={12}>
          {error && <Typography variant="body2" color="error">{error}</Typography>}
        </Grid>
        {text && (
          <Grid item xs={12}>
            <Box mt={3}>
              <Typography variant="h6">Original Text</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={text}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Grid>
        )}
        {summary && (
          <Grid item xs={12}>
            <Box mt={3}>
              <Typography variant="h6">Summary</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={summary}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box mt={3}>
            <Typography variant="body2" color="textSecondary">
              Note: Supported file types: .txt, .pdf
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FileUpload;
