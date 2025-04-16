"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var node_fetch_1 = require("node-fetch");
// Load environment variables from .env file
dotenv.config();
var apiKey = process.env.GEMINI_API_KEY; // Retrieve the API key from environment variables
if (!apiKey) {
    console.error('❌ API key not found! Make sure your .env file has GEMINI_API_KEY=your_key_here');
    process.exit(1); // Exit if API key is not found
}
var errorMessage = 'Cannot read property "foo" of undefined'; // The error message you want to explain
// Function to fetch explanation from Gemini API
function fetchExplanation(errorMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var url, body, response, _a, _b, _c, data, explanation, error_1;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=".concat(apiKey);
                    body = JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: "Explain the following error in simple terms:\n\n".concat(errorMessage)
                                    }
                                ]
                            }
                        ]
                    });
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: body,
                        })];
                case 2:
                    response = _j.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    _b = (_a = console).error;
                    _c = ['❌ Error from Gemini API:'];
                    return [4 /*yield*/, response.text()];
                case 3:
                    _b.apply(_a, _c.concat([_j.sent()]));
                    return [2 /*return*/, undefined];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _j.sent();
                    console.log('API Response:', data);
                    explanation = (_h = (_g = (_f = (_e = (_d = data.candidates) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.parts) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.text;
                    if (explanation) {
                        return [2 /*return*/, explanation];
                    }
                    else {
                        console.error('❌ No explanation found in the API response.');
                        return [2 /*return*/, undefined];
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _j.sent();
                    console.error('❌ Error during fetch operation:', error_1);
                    return [2 /*return*/, undefined];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Run the fetch explanation function
fetchExplanation(errorMessage)
    .then(function (explanation) {
    if (explanation) {
        console.log('Explanation:', explanation);
    }
    else {
        console.error('❌ No explanation received.');
    }
})
    .catch(function (error) {
    console.error('❌ Error:', error);
});
