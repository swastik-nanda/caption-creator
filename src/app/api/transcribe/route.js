import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from '@aws-sdk/client-transcribe';

function getClient() {
  return new TranscribeClient({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

function createTranscriptionCommand(fileName) {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: fileName,
    OutputBucketName: process.env.BUCKET_NAME,
    OutputKey: `${fileName}.transcription`,
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: `s3://${process.env.BUCKET_NAME}/${fileName}`,
    },
  });
}

async function createTranscriptionJob(fileName) {
  const transcribeClient = getClient();
  const transcriptionCommand = createTranscriptionCommand(fileName);
  return transcribeClient.send(transcriptionCommand);
}

async function getJob(fileName) {
  const transcribeClient = getClient();
  let jobStatusResult = null;
  try {
    const transcriptionJobStatusCommand =
      new GetTranscriptionJobCommand({
        TranscriptionJobName: fileName,
      });

    jobStatusResult = await transcribeClient.send(
      transcriptionJobStatusCommand
    );
  } catch (e) {
    console.log(e);
  }
  return jobStatusResult;
}

async function getTranscriptionFile(fileName) {
  const transcriptionFile = `${fileName}.transcription`;
  const s3client = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: transcriptionFile,
  });

  let transcriptionFileResponse = null;
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand);
  } catch (e) {
    console.log(e);
  }

  if (transcriptionFileResponse) {
    console.log(transcriptionFileResponse);
  }
}

export async function GET(req) {
  const url = new URL(req.url); // Parse the URL to extract query parameters
  const fileName = url.searchParams.get('filename'); // Get the filename parameter

  if (!fileName) {
    return new Response(
      JSON.stringify({ error: 'Filename is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Find ready Transcription
  await getTranscriptionFile(fileName);
  // Check if the transcription job exists first
  const existingJobFound = await getJob(fileName);

  if (existingJobFound) {
    return Response.json({
      status:
        existingJobFound.TranscriptionJob.TranscriptionJobStatus,
    });
  }
  // creating new transcription
  if (!existingJobFound) {
    const newJob = await createTranscriptionJob(fileName);
    return Response.json({
      status: newJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }

  return Response.json(null);
}
