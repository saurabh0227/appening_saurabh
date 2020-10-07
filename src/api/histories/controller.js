const model = require('./model');

exports.saveHistory = async (hisData) => {
  try {
    const history = await model.create(hisData);
    return history;
  } catch (error) {
    console.log(`saveHostory => ${error}`);
    return error;
  }
};

exports.getHistories = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      res.status(200).send({
        status: false,
        success: null,
        error: { message: 'Only admin can fetch histories!' },
      });
    } else {
      let searchQuery;
      if (req.query.city) {
        searchQuery = Object.assign(
          { 'ipDetails.geoplugin_city': req.query.city },
          searchQuery
        );
      }
      if (req.query.state) {
        searchQuery = Object.assign(
          { 'ipDetails.geoplugin_region': req.query.state },
          searchQuery
        );
      }
      if (req.query.country) {
        searchQuery = Object.assign(
          { 'ipDetails.geoplugin_countryName': req.query.country },
          searchQuery
        );
      }
      if (req.query.lng && req.query.lat && req.query.maxDistance) {
        searchQuery = Object.assign(
          {
            location: {
              $near: {
                $maxDistance: parseInt(req.query.maxDistance),
                $geometry: {
                  type: 'Point',
                  coordinates: [
                    parseInt(req.query.lng),
                    parseInt(req.query.lat),
                  ],
                },
              },
            },
          },
          searchQuery
        );
      }
      const histories = await model.find(searchQuery).sort({ createdAt: -1 });
      if (histories.length === 0) {
        res.status(700).send({
          status: false,
          success: null,
          error: {
            message: 'No history found!',
          },
        });
      } else {
        res.status(200).send({
          status: true,
          success: {
            message: 'Histories fetched successfully!',
            data: histories,
          },
          error: null,
        });
      }
    }
  } catch (error) {
    console.log(`getHistory => ${error}`);
    res.status(500).send({
      status: false,
      success: null,
      error: {
        message: 'Something went wrong!',
      },
    });
  }
};
