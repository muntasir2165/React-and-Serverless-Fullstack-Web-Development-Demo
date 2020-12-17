const { table, getHighScores } = require('./utils/airtable');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ err: 'That method is not allowed' }),
    };
  }

  const { score, name } = JSON.parse(event.body);
  if (!score || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err: 'Bad request' }),
    };
  }

  try {
    const records = await getHighScores(false);

    // we've got formatted records in order of highest to lowest
    // the lowest record is at index 9
    const lowestRecord = records[9];
    if (
      typeof lowestRecord.fields.score === 'undefined' ||
      score > lowestRecord.fields.score
    ) {
      // update this record with the incoming score
      const updatedRecord = { id: lowestRecord.id, fields: { name, score } };
      await table.update([updatedRecord]);
      return {
        statusCode: 200,
        body: JSON.stringify({
          updatedRecord,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        records,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        err: 'Failed to save score in Airtable',
      }),
    };
  }
};
