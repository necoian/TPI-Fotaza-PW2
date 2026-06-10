const Post = require('./Post');
const Image = require('./Image');
const Comment = require('./Comment');
const Usuario = require('./Usuario');
const Rating = require('./Rating');      
const Interested = require('./Interested'); 
const Follower = require('./Follower');


Usuario.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(Usuario, { foreignKey: 'user_id' });

Post.hasMany(Image, { foreignKey: 'post_id' });
Image.belongsTo(Post, { foreignKey: 'post_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

Usuario.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(Usuario, { foreignKey: 'user_id' });


// Relaciones para Calificaciones
Image.hasMany(Rating, { foreignKey: 'image_id' });
Rating.belongsTo(Image, { foreignKey: 'image_id' });

Usuario.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(Usuario, { foreignKey: 'user_id' });

Image.hasMany(Interested, { foreignKey: 'image_id' });
Interested.belongsTo(Image, { foreignKey: 'image_id' });

Usuario.hasMany(Interested, { foreignKey: 'user_id' });
Interested.belongsTo(Usuario, { foreignKey: 'user_id' });

Follower.belongsTo(Usuario, { as: 'Seguidor', foreignKey: 'follower_id' });
Follower.belongsTo(Usuario, { as: 'Siguiendo', foreignKey: 'following_id' });

Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'Siguiendo',
    foreignKey: 'follower_id',
    otherKey: 'following_id'
});

Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'Seguidores',
    foreignKey: 'following_id',
    otherKey: 'follower_id'
});

module.exports = {
    Post,
    Image,
    Comment,
    Usuario,
    Rating,      
    Interested,
    Follower
};