const Story = require("../models/Story");

exports.addStory = async (req, res) => {
  try {
    const story = await Story.create({
      user: req.user._id,
      media: req.file.path,
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
    }).populate("user", "username profilePic");

    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addView = async(req,res)=>{

 const post = await Post.findById(req.params.id)

 post.views += 1

 await post.save()

 res.json({views:post.views})

}
exports.viewStory = async(req,res)=>{

 try{

  const story = await Story.findById(req.params.id)

  if(!story.views.includes(req.user._id)){
   story.views.push(req.user._id)
  }

  await story.save()

  res.json({views:story.views.length})

 }catch(err){
  res.status(500).json({error:err.message})
 }

}
exports.createStory = async (req,res)=>{
 try{

  const media = req.file.path

  const story = await Story.create({
   user:req.user._id,
   media:media,
   type:req.body.type || "image"
  })

  res.json(story)

 }catch(err){
  res.status(500).json({error:err.message})
 }
}
exports.getStoryViewers = async (req,res)=>{
 try{

  const story = await Story.findById(req.params.id)
   .populate("viewers","username profilePic")

  res.json(story.viewers)

 }catch(err){
  res.status(500).json({error:err.message})
 }
}
