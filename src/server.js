'use strict';

var
	debug = require('debug')('bag-tracer:server'),
	express = require('express'),
	app = express();

var
	refreshRate = 30;

app.get('/:airline/:ref/:name', (req, res) => {

	trace(
		req.params.airline,
		req.params.ref,
		req.params.name,
		(output) => {
			res.send(`
				<html>

				<span>Refresh in </span>
				<span id="_t">${refreshRate}</span><span>s</span>

				<div id="output">
					<pre>${output}</pre><br>
				</div>

				<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
				<script>
				var _t = ${refreshRate};

				setInterval(function() {
					_t -= 1;

					$('#_t').html(_t);

					if (!_t) {
						_t = ${refreshRate};

						$
							.get('/ping/${req.params.airline}/${req.params.ref}/${req.params.name}?=' + Date.now())
							.then(function(body) {
								$('#output').prepend($(body));
							})
					}
				}, 1000);
				</script>

				</html>
			`);
		}
	);
});

app.get('/ping/:airline/:ref/:name', (req, res) => {
	trace(
		req.params.airline,
		req.params.ref,
		req.params.name,
		(output) => {
			res.send(`<pre>${output}</pre><br>`);
		}
	);
});

if (require.main === module) {
	let server = app.listen(4000, () => {
		let
			host = server.address().address,
			port = server.address().port;

		debug('listening at http://%s:%s', host, port);
	});
}
