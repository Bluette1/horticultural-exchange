import fileChecksum from '../utils/checksum';
import { httpProtocol, host, port } from '../env.variables';
import authHeader from './auth-header';

const parser = require('fast-xml-parser');

const BASE_URL = `${httpProtocol}://${host}:${port}`;
const PLANTS_API_ENDPOINT = `${BASE_URL}/api/plants`;
const PRESIGNED_URL_API_ENDPOINT = `${BASE_URL}/presigned_url`;

const createPresignedUrl = async (file, byteSize, checksum) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      file: {
        filename: file.name,
        byteSize,
        checksum,
        content_type: file.type,
      },
    }),
  };
  const res = await fetch(PRESIGNED_URL_API_ENDPOINT, options);
  if (res.status !== 200) return res;
  const resJson = await res.json();
  return resJson;
};

const uploadImage = async (image) => {
  const checksum = await fileChecksum(image);
  const presignedFileParams = await createPresignedUrl(
    image,
    image.size,
    checksum,
  );
  // 2) send file to said POST request (to S3)
  const formData = new FormData();

  const fields = presignedFileParams.url_fields;
  const keys = Object.keys(fields);
  for (let index = 0; index < keys.length; index += 1) {
    formData.append([keys[index]], fields[keys[index]]);
  }
  formData.append('file', image);
  const s3PutOptions = {
    method: 'POST',
    body: formData,
  };
  const presignedUrl = presignedFileParams.url;
  const awsRes = await fetch(presignedUrl, s3PutOptions);
  return awsRes;
};

export const createPlant = async (plantInfo) => {
  const {
    image, name, category, price,
  } = plantInfo;

  // To upload image file to S3, we need to do three steps:
  // 1) request a pre-signed POST request (for S3) from the backend
  let imageUrl;
  if (image) {
    const awsRes = await uploadImage(image);
    if (awsRes.status !== 201) return awsRes;
    const body = await awsRes.text();
    const jsonObj = parser.parse(body);
    imageUrl = jsonObj.PostResponse.Location;
  }

  // 3) confirm & create plant with backend
  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', name);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('image_url', imageUrl);
  const plantsPostOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: formData,
  };
  const res = await fetch(PLANTS_API_ENDPOINT, plantsPostOptions);
  if (res.status !== 200) return res;
  const resJson = await res.json();
  return resJson;
};

export const updatePlant = async (id, plantInfo) => {
  const {
    image, name, category, price, description, commonName, inStock, care,
  } = plantInfo;

  // To upload image file to S3, we need to do three steps:
  // 1) request a pre-signed POST request (for S3) from the backend
  let imageUrl;
  if (image) {
    const awsRes = await uploadImage(image);
    if (awsRes.status !== 201) return awsRes;
    const body = await awsRes.text();
    const jsonObj = parser.parse(body);
    imageUrl = jsonObj.PostResponse.Location;
  }

  // 3) confirm & update plant with backend
  const plantsPostOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      plant: {
        name,
        category,
        price,
        description,
        care,
        common_name: commonName,
        in_stock: inStock,
        image_url: imageUrl,
      },
    }),
  };
  const res = await fetch(`${PLANTS_API_ENDPOINT}/${id}`, plantsPostOptions);
  if (res.status !== 200) return res;
  const resJson = await res.json();
  return resJson;
};
