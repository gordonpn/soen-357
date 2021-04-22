import axios from 'axios';

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
const getParkings = async () => {
  const dataRange = range(0, 300, 100);
  const parkings = dataRange.map(async (idx) => {
    const options = {
      method: 'get',
      url: 'https://data.montreal.ca/api/3/action/datastore_search',
      params: {
        offset: idx,
        resource_id: '32821ddd-d893-41ff-9d02-ea94fbc6c930',
      },
    };

    const res = await axios(options);
    return res.data?.result?.records;
  });

  const res = await Promise.all(parkings);
  const val = res.flat();
  console.log(val);
  return val;
};

export { getParkings };
