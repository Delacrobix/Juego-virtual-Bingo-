const DateSchema = require("../models/date");

getDeadLine = () => {
  const date = new DateSchema();

  return date.calculateDeadline(10);
};

getRemainTime = (remain) => {
  let remain_seconds = ("0" + Math.floor(remain % 60)).slice(-2);
  let remain_minutes = ("0" + Math.floor((remain / 60) % 60)).slice(-2);

  return {
    remain: remain,
    seg: remain_seconds,
    min: remain_minutes,
  };
};

exports.startCountdown = async (socket) => {
  const deadline = getDeadLine();

  const timer_update = setInterval(async () => {
    let now = new Date();

    let remain = ((deadline - now + 1000) / 1000) % 60;
    let t = getRemainTime(remain);

    console.log(remain);

    socket.broadcast.emit('server:count', {
      seg: t.seg,
      min: t.min,
    });

    if (t.remain < 1) {
      await deleteFlag();

      socket.emit('server:start-game', {});

      clearInterval(timer_update);
    }
  }, 1000);
};

exports.findDate = async () => {
  let date = await DateSchema.findOne();

  if (date) {
    return true;
  }

  return false;
};

exports.saveFlag = async () => {
  let flag = new DateSchema({
    flag: 0,
  });

  await flag.save((err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
};

deleteFlag = async () => {
  await DateSchema.deleteMany({ flag: { $gte: 0 } })
    .then(function () {
      console.log('Data deleted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
};