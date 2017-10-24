
// Import external dependencies.
import Ractive from 'ractive';
import template from './app.html';
import sass from './app.sass';

// Caching references to global data.
const users = window.users;
const rawPosts = window.posts;
const images = window.images;

// Cache module-level variables.
const maximumCharacters = 140;

// Create our global Ractive application instance.
const app = Ractive({
    target: '#BrandonsFTProject',
    template,
    data: function () {
        return {
            testWords: `Awesome! Really really awesome!`
        }
    },
});

// Export the instance.
export default app;