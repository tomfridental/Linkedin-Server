const express = require('express');
const User = require('../db/user.model')
const Post = require('../db/post.model');
const Like = require('../db/like.model');
const Comment = require('../db/comment.model');
const SubComment = require('../db/subcomment.model')
const multer = require('multer')
const cloudinary = require('cloudinary');


var upload = multer({ dest: '/tmp/uploads' })

cloudinary.config({
    cloud_name: 'tomfr',
    api_key: '729789689824447',
    api_secret: '_GkX3bbKW2PcfqyalQxnUWWrVao'
});


const router = express.Router();
router.use(express.json())


//Test Route
router.get('/', (req, res) => {
    res.json({ Hello: 'Worlddd' })
})

//Create new Post
router.post('/create/post', upload.single('img'), async (req, res, next) => {
    try {
        let body = JSON.parse(req.body.text)
        if (req.file) {
            let result = await cloudinary.v2.uploader.upload(req.file.path)
            const post = new Post({ ...body, img: result.url });
            await post.save()
            let postAuthUser = await User.findById(body.userID).lean()
            let postInfo = await Post.findById(post._id).lean()
            let newPost = {
                likes: [],
                comments: [],
                postAuthUser: postAuthUser,
                ...postInfo
            }
            res.json({
                msg: 'User Saved!',
                postSaved: true,
                post: newPost
            })
        }


        else {
            const post = new Post(body);
            await post.save()
            let postAuthUser = await User.findById(body.userID).lean()
            let postInfo = await Post.findById(post._id).lean()
            let newPost = {
                likes: [],
                comments: [],
                postAuthUser: postAuthUser,
                ...postInfo
            }
            res.json({
                msg: 'User Saved!',
                postSaved: true,
                post: newPost
            })
        }
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Create new Comment
router.post('/create/comment', async (req, res, next) => {
    try {
        const comment = new Comment(req.body);
        await comment.save()
        let postAuthUser = await User.findById(req.body.userID).lean()
        let commentInfo = await Comment.findById(comment._id).lean()

        let newComment = {
            likes: [],
            subComments: [],
            userInfo: postAuthUser,
            ...commentInfo
        }

        res.json({
            msg: 'Comment Saved!',
            comment: newComment
        })
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Create new SubComment
router.post('/create/subcomment', async (req, res, next) => {
    try {
        const subComment = new SubComment(req.body);
        await subComment.save()
        let postAuthUser = await User.findById(req.body.userID).lean()
        let commentInfo = await SubComment.findById(subComment._id).lean()

        let newComment = {
            likes: [],
            subUserInfo: postAuthUser,
            ...commentInfo
        }

        res.json({
            msg: 'Comment Saved!',
            subcomment: newComment
        })
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Create new Like
router.post('/create/like', async (req, res, next) => {
    try {
        const like = await Like.findOne({ targetID: req.body.targetID, userID: req.body.userID })
        if (like) {
            await like.delete()
            res.json({ likeMsg: 'Like Deleted!' })
        }
        else {
            const like = new Like(req.body);
            await like.save()
            res.json({ likeMsg: 'Like Saved!' })
        }
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Get Likes//
router.get('/likes/:id', async (req, res, next) => {
    try {
        const likes = await Like.find({ targetID: req.params.id }).lean()

        let testArr = []
        for (var i = 0; i < likes.length; i++) {
            testArr.push(
                likes[i]

            );
            let userInfo = await User.findById(likes[i].userID)
            testArr[i] = { ...testArr[i], userInfo, likes }
        }


        res.json([...testArr])


    } catch (err) {
        console.log('New Error: ', err)
    }
})


//Get Comments for Post
router.get('/comment/:id', async (req, res, next) => {
    try {
        const comments = await Comment.find({ targetID: req.params.id }).sort({ createdAt: 1 }).lean()
        let newArr = []
        for (var i = 0; i < comments.length; i++) {
            newArr.push(
                comments[i]

            );
            let userInfo = await User.findById(comments[i].userID)
            let likes = await Like.find({ targetID: comments[i]._id })
            let subComments = await SubComment.find({ targetID: comments[i]._id }).lean()

            let subCommentsWithInfo = []
            for (let subComment of subComments) {
                let subUserInfo = await User.findById(subComment.userID).lean()
                let likes = await Like.find({ targetID: subComment._id })
                let temp = await { ...subComment, subUserInfo, likes }
                await subCommentsWithInfo.push(temp)
            }

            newArr[i] = { ...newArr[i], userInfo, likes, subComments: subCommentsWithInfo }
        }
        res.json({
            commentsArr: [...newArr],
            postID: req.params.id
        })
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Get User info
router.get('/:id', async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id)
        res.json({ user })

    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Get Users to fallow
router.get('/userstofallow/:id', async (req, res, next) => {
    let limitInt = parseInt(req.query.limit)
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).sort({ createdAt: -1 }).limit(limitInt)
        res.json({ users })

    } catch (err) {
        console.log('New Error: ', err)
    }
})

// Get Selected User Profile and 10 users he can fallow
router.get('/profile/:id', async (req, res, next) => {
    let limitInt = parseInt(req.query.limit)
    try {
        const user = await User.findById(req.params.id)
        const usersToFallow = await User.find({ _id: { $ne: req.params.id } }).sort({ createdAt: -1 }).limit(limitInt)
        const userLastComments = await Comment.find({ userID: req.params.id }).sort({ createdAt: -1 }).limit(4)

        res.json({
            user,
            usersToFallow,
            userLastComments
        })

    } catch (err) {
        console.log('New Error: ', err)
    }
})


// Get 10 Posts with their likes and comments (without user's info)
router.get('/posts/:id', async (req, res, next) => {
    let offSet = parseInt(req.query.offset)
    try {
        const posts = await Post.find({ userID: { $ne: req.params.id } }).sort({ createdAt: -1 }).limit(10).skip(offSet).lean()
        let newArr = []

        for (var i = 0; i < posts.length; i++) {
            newArr.push(posts[i]);

            let postAuthUser = await User.findById(posts[i].userID)
            let likes = await Like.find({ targetID: posts[i]._id });
            let comments = await Comment.find({ targetID: posts[i]._id }).lean()
            for (var y = 0; y < comments.length; y++) {
                comments[y].subComments = []
            }
            newArr[i] = { ...newArr[i], comments, likes, postAuthUser }
        }
        res.json([...newArr])
    } catch (err) {
        console.log('New Error: ', err)
    }
})

//Finish Signup with user Avatar
router.post('/finish/:id', upload.single('avatar'), async (req, res) => {

    try {
        const selectedUser = await User.findById(req.params.id);

        let result = await cloudinary.v2.uploader.upload(req.file.path)


        await selectedUser.updateOne({ registrationWizard: 'done', avatar: result.url })
        const updatedUser = await User.findById(req.params.id)

        res.json({ selectedUserUpdate: updatedUser })

    }
    catch (err) {
        console.log('New Error: ', err)
    }
})

router.post('/finish/noavatar/:id', async (req, res) => {

    try {
        const selectedUser = await User.findById(req.params.id);
        await selectedUser.updateOne({ registrationWizard: 'done', avatar: 'https://res.cloudinary.com/tomfr/image/upload/v1546460228/blank-profile-picture-973460_960_720.png' })
        const updatedUser = await User.findById(req.params.id)

        res.json({ selectedUserUpdate: updatedUser })

    }
    catch (err) {
        console.log('New Error: ', err)
    }
})

//Get 10 Last Users for Search Result  || Get Users match the search term
router.get('/search/:id', async (req, res) => {
    try {
    
        if (req.query.search !== "") {
            const searchSuggestions = await User.find({_id: { $ne: req.params.id },
                $or: [
                {first_name: { "$regex": req.query.search, "$options": "i" }},
                {last_name: { "$regex": req.query.search, "$options": "i" }}
                ]
            }).sort({ createdAt: -1 }).limit(10);
            
            res.json(searchSuggestions)
        
        } else {
            const searchSuggestions = await User.find({ _id: { $ne: req.params.id } }).sort({ createdAt: -1 }).limit(10);
            res.json(searchSuggestions)
        }

    }
    catch (err) {
        console.log('Your Error is: ', err)
        res.json(err)
    }
})
module.exports = router