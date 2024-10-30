const { Post } = require('../models');

const checkPostOwner = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkPostOwner;