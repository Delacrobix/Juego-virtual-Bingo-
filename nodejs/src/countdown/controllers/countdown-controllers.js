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

const addCero = valor => {
	if (valor < 10) {
		return "0" + valor;
	} else {
		return "" + valor;
	}
}

function millisecondsToSecondsAndMinutes(milliseconds) {
	let minutes = parseInt(milliseconds / 1000 / 60);
	milliseconds -= minutes * 60 * 1000;
	let seconds = (milliseconds / 1000);

  seconds = addCero(seconds.toFixed(1));
  minutes = addCero(minutes);

	return {
    min: minutes,
    sec: seconds
  };
};

exports.startCountdown = async (io) => {
  let timeout = 15000;

  let timerId = setInterval(() => { 
    io.to('room:lobby').emit("server:time", millisecondsToSecondsAndMinutes(timeout));
    timeout = timeout - 1000;

  }, 1000);

  setTimeout(async () => { 
    clearInterval(timerId); 
    await deleteFlag();

    io.to('room:lobby').emit("server:time", false);

  }, timeout + 1000);
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
      console.log('Date deleted.'); 
    })
    .catch(function (error) {
      console.log(error); 
    });
};