let Sequelize = require('sequelize');
let db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

let Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        len: [2, 40]
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        isUrl: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'open'
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
}, {
    getterMethods: {
        route: function() {
            return '/wiki/' + this.urlTitle
        }
    },
    classMethods: {
        findByTag: function(tag) {
            return Page.findAll( {
                where: {tags: { $overlap: [tag] }}
            })
        }
    }
});

let User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        len: [2, 15]
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

Page.hook('beforeValidate', function(page) {
    page.urlTitle = '/wiki/' + generateUrlTitle(page.title);
});

Page.belongsTo(User, { as: 'author' });

//Helper Functions
function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

//Export
module.exports = {
  Page: Page,
  User: User
};