module.exports = app => {
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/results', (req, res) => {
        res.render('results')
    })
}