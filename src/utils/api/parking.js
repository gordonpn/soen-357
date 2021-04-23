import axios from 'axios';

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const getParkings = async () => {
  const dataRange = range(0, 18400, 100);
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
  return res.flat().filter((parking) => {
    return !parking.sNoPlace.startsWith('YY') && Math.random() > 0.8;
  });
};

const getParkingPeriods = async (sNoPlace) => {
  const regulationOptions = {
    method: 'get',
    url: 'https://data.montreal.ca/api/3/action/datastore_search',
    params: {
      filters: {
        sNoEmplacement: sNoPlace,
      },
      resource_id: 'e915d611-87d1-4ae1-a127-33a98ccf84f7',
    },
  };

  const {
    data: {
      result: { records: regulationCodes },
    },
  } = await axios(regulationOptions);

  const periodCodes = [];

  regulationCodes.forEach(async (code) => {
    const regulationPeriodOptions = {
      method: 'get',
      url: 'https://data.montreal.ca/api/3/action/datastore_search',
      params: {
        filters: {
          sCode: code.sCodeAutocollant,
        },
        resource_id: 'bd0df28d-7813-4d27-b445-129fb214f7f7',
      },
    };

    const {
      data: {
        result: { records: periods },
      },
    } = await axios(regulationPeriodOptions);

    periods.forEach((thisPeriod) => {
      periodCodes.push(thisPeriod);
    });
  });

  return periodCodes;
};

export { getParkings, getParkingPeriods };
