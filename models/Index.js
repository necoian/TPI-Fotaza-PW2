const Usuario = require('./Usuario');
const Post = require('./Post');
const Image = require('./Image');


Usuario.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(Usuario, { foreignKey: 'user_id' });


Post.hasMany(Image, { foreignKey: 'post_id' });
Image.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = {
    Usuario,
    Post,
    Image
};