const DateSchema = require('../models/date');

exports.getRemainTime = (remain) => {
  // let now = new Date();
  // let remain = (new Date(deadline) - now + 1000) / 1000;
  let remain_seconds = ("0" + Math.floor(remain % 60)).slice(-2);
  let remain_minutes = ("0" + Math.floor((remain / 60) % 60)).slice(-2);

  return {
    remain: remain,
    seg: remain_seconds,
    min: remain_minutes,
  };
}

exports.findDate = async (req, res) => {
  let date = await DateSchema.findOne();

  if(!date){
    console.log('Date not found');
  }
}