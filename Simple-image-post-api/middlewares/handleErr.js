module.exports = (err, req, res, next) => {
    if(err) {
        console.log(`${err.message} from ${err.from}`);
        return res.status(500).send('Internal server error');
    }
}