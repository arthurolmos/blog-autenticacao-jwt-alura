module.exports = (req, res, next) => {
  const accept = req.get("Accept");

  console.log(accept);

  if (accept !== "application/json" && accept !== "*/*") {
    return res.status(406).end();
  }

  res.set({
    "Content-Type": "application/json",
  });

  next();
};
