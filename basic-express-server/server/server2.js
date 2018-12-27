/*

READ ME:

The following code is an example of handling server requests in NodeJS
from a browser without using a back-end framework like ExpressJS

*/

const http = require('http');
console.log('--- Running server2.js\r\n');
const { parse } = require('querystring');

let getRequestData = (request, callback) => {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', (chunk) => body += String(chunk));
        request.on('end', () => callback(parse(body)));
        console.log(body, '\r\n--- Form Data Loaded!\r\n');
    } else {
        callback(null);
    }
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log('--- POST Request from browser');
        getRequestData(req, (result) => {
            let resultArray = [];
            let resultHTMLArray = [];
            let resultHTMLString;

            /* For each object key pair in the result, push key string to a new array (for console log),
            and push the key/value pair to an array of <h3> elements for static page to be served */
            Object.keys(result).forEach((val) => {
                resultArray.push(String(result[val]));
                resultHTMLArray.push(`<h3>${val}: ${result[val]}</h3>`);
            });

            /* Concatenate each element of resultHTMLArray into one long string of html,
            to be inserted into a statically served HTML template for results */
            resultHTMLString = String(resultHTMLArray.join(''));
            console.log(`--- Parsed:\r\n${resultArray}`);

            /* Serve the result template, passing the HTML string from above */
            res.end(documentBodyComp(resultComp(resultHTMLString)));
        });
    } else {
        res.end(documentBodyComp(
            { component: formComp() }
        ));
    }
});

server.listen(4040);


// ==============================================================================================
// =================================  HTML Component Templates  =================================
// ==============================================================================================


let documentBodyComp = ({state = null, component = null, placeholder = null}) => {
    return `
        <!doctype html>
        <html>
            <body>
                ${{component}.component}
            </body>
        <html>
    `
}

let formComp = ({state = null, component = null, placeholder = null}) => {
    return `
        <form action="/" method="post">
            <input type="text" name="fname" placeholder="Name"/><br />
            <input type="number" name="age" placeholder="Age"/><br />
            <div>
                <label for="upload-photo" style="width: 100%">Upload a photo:</label>
            </div>
            <input type="file" name="photo" id="upload-photo"/><br />
            <button>Save</button>
        </form>
    `;
}

let resultComp = ({state = null, component = null, placeholder = null}) => {
    return `
        <h1>File Uploaded:</h1>
        ${{component}.component}
    `
}


// ==============================================================================================
// =====================================  Helper Functions  =====================================
// ==============================================================================================



// Still working on componentTypeCheck ============================================
const componentTypeCheck = (component = null, undefined = undefined) => {
    const rawComponent = component;
    return () => {
        if (rawComponent === null) return String(rawComponent);
        if (rawComponent === String(rawComponent)) return String(rawComponent);
        if (rawComponent === Number(rawComponent)) return String(rawComponent);
        if (rawComponent instanceof Object) {
            if (isArray(rawComponent)) {
                // Still working on logic here
            }
        }
    };
}
// Still working on componentTypeCheck ============================================



/*
    fn() wraps around our function parameters, allowing us to specify required parameters.
    If required parameters are included during implementation, the function is executed normally.
    If parameter requirements are not met, an error is thrown.
*/
const fn = (fn, { required = [] }) =>   /* 1st arg should be anonymous function that returns an object of our desired parameters (e.g. () => {param1 = val1, param2 = val2})
                                        2nd arg should be an object containing an array of required parameters */

    (params = {}) => {                  /* 1st and 2nd args are passed to params to be evaluated */
        const missing = required.filter(requiredParam => !(requiredParam in params));   /* determine if any required parameters are missing */
        if (missing.length) {                       /* if any parameters were added to the 'missing' array */
            throw new Error(`${fn.name}() Missing required parameter(s): ${missing.join(', ')}`); /* throw an error telling us which parameters are missing */
        }
        return fn(params);              /* finally, we execute the function with the passed parameters if error was not thrown */
    }


const createHTMLComponent = fn(
    ({ component = '', placeholder = '' } = {}) => {
        return { component, placeholder };
    }, { required: ['component'] }
);


const createEmployee = fn(
    // anonymous function returns the parameters for fn(), which are passed to fn()'s function body
    ({ name = '', hireDate = Date.now(), title = 'Worker Drone' } = {}) => ({ name, hireDate, title }), // passing that object as an argument into the '(params = {})' parameter
    { required: ['name'] } // specifying required parameters
);
