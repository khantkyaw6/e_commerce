const { Readable } = require('stream');

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuid } = require('uuid');

const awsCredentials = require('../config/aws.config');

const s3Client = new S3Client({});

const toCategory = async (file) => {
  const bodyStream = Readable.from(file.buffer);

  // Create an Upload instance
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsCredentials.bucketName,
      Key: `public/upload/categories/${uuid()}-${file.originalname}`,
      Body: bodyStream,
    },
  });

  return upload.done();
};

const toCategorySubgroup = async (file) => {
  const bodyStream = Readable.from(file.buffer);

  // Create an Upload instance
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsCredentials.bucketName,
      Key: `public/upload/categorysubgroups/${uuid()}-${file.originalname}`,
      Body: bodyStream,
    },
  });

  return upload.done();
};

const toSubcategory = async (file) => {
  const bodyStream = Readable.from(file.buffer);

  // Create an Upload instance
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsCredentials.bucketName,
      Key: `public/upload/subcategories/${uuid()}-${file.originalname}`,
      Body: bodyStream,
    },
  });

  return upload.done();
};

const toBrand = async (file) => {
  const bodyStream = Readable.from(file.buffer);

  // Create an Upload instance
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsCredentials.bucketName,
      Key: `public/upload/brands/${uuid()}-${file.originalname}`,
      Body: bodyStream,
    },
  });

  return upload.done();
};

module.exports = {
  toCategory,
  toCategorySubgroup,
  toSubcategory,
  toBrand,
};
