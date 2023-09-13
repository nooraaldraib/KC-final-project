const data = {
  currentUser: {
    image: {
      png: "assets/images/avatars/image-amyrobson.png",
      webp: "assets/images/avatars/image-amyrobson.webp",
    },
    username: "NooraAldraib",
  },
  comments: [
    {
      parent: 0,
      id: 1,
      content:
        "اليوم سوف يتم انشاء موقع الكتروني لاغاثة المنكوبين في زلزال المغرب .. اللي راح يبرمجونه متطوعينا في حملة برمج للخير",
      createdAt: "3 days ago",
      user: {
        image: {
          png: "assets/images/avatars/image-amyrobson.png",
          webp: "assets/images/avatars/image-amyrobson.webp",    
        },
        username: "NooraAldraib",
      },
      replies: [
        {
          parent: 2,
          id: 1,
          content:
            "الله يرفع عن اخوانا في المغرب الشقيق, متحمس للمشاركة.",
          createdAt: "3 days ago",
          replyingTo: "NooraAldraib",
          user: {
            image: {
              png: "assets/images/avatars/image-juliusomo.png",
              webp: "assets/images/avatars/image-juliusomo.webp",
            },
            username: "Marzooq",
          },
        }],
    },
    {
      parent: 0,
      id: 2,
      content:
      "السلام عليكم شباب عندنا حملة نبي نتعاون و نصبغ أسوار المدارس اللي مشخبطين عليهم راح نبلش بمنطقة بيان ان شاء الله و عقب باجي المناطق منو معانا؟",
      createdAt: "5 days ago",
      user: {
        image: {
          png: "assets/images/avatars/image-amyrobson.png",
          webp: "assets/images/avatars/image-amyrobson.webp",
        },
        username: "NooraAldraib",
      },
      replies: [
        {
          parent: 2,
          id: 1,
          content:
            "راح أكون أول المتواجدين إن شاء الله",
          createdAt: "2 days ago",
          replyingTo: "FadelSattar",
          user: {
            image: {
              png: "assets/images/avatars/image-ramsesmiron.png",
              webp: "assets/images/avatars/image-ramsesmiron.webp",
            },
            username: "Mohammed",
          },
          
          replies: [
            {
              parent: 2,
              id: 1,
              content:
                "قواك الله",
              createdAt: "2 days ago",
              replyingTo: "Mohammed",
              user: {
                image: {
                  png: "assets/images/avatars/image-maxblagun.png",
                  webp: "assets/images/avatars/image-maxblagun.webp",
                },
                username: "FadelSattar",
              },
            },
          ],
        },
      ],
    },
  ],
};
function appendFrag(frag, parent) {
  var children = [].slice.call(frag.childNodes, 0);
  parent.appendChild(frag);
  //console.log(children);
  return children[1];
}

const addComment = (body, parentId, replyTo = undefined) => {
  let commentParent =
    parentId === 0
      ? data.comments
      : data.comments.filter((c) => c.id == parentId)[0].replies;
  let newComment = {
    parent: parentId,
    id:
      commentParent.length == 0
        ? 1
        : commentParent[commentParent.length - 1].id + 1,
    content: body,
    createdAt: "Now",
    replyingTo: replyTo,
    replies: parent == 0 ? [] : undefined,
    user: data.currentUser,
  };
  commentParent.push(newComment);
  initComments();
};
const deleteComment = (commentObject) => {
  if (commentObject.parent == 0) {
    data.comments = data.comments.filter((e) => e != commentObject);
  } else {
    data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
      data.comments
        .filter((e) => e.id === commentObject.parent)[0]
        .replies.filter((e) => e != commentObject);
  }
  initComments();
};

const promptDel = (commentObject) => {
  const modalWrp = document.querySelector(".modal-wrp");
  modalWrp.classList.remove("invisible");
  modalWrp.querySelector(".yes").addEventListener("click", () => {
    deleteComment(commentObject);
    modalWrp.classList.add("invisible");
  });
  modalWrp.querySelector(".no").addEventListener("click", () => {
    modalWrp.classList.add("invisible");
  });
};

const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
  if (parent.querySelectorAll(".reply-input")) {
    parent.querySelectorAll(".reply-input").forEach((e) => {
      e.remove();
    });
  }
  const inputTemplate = document.querySelector(".reply-input-template");
  const inputNode = inputTemplate.content.cloneNode(true);
  const addedInput = appendFrag(inputNode, parent);
  addedInput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = addedInput.querySelector(".cmnt-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, parentId, replyTo);
  });
};

const createCommentNode = (commentObject) => {
  const commentTemplate = document.querySelector(".comment-template");
  var commentNode = commentTemplate.content.cloneNode(true);
  commentNode.querySelector(".usr-name").textContent =
    commentObject.user.username;
  commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
  commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
  commentNode.querySelector(".c-body").textContent = commentObject.content;
  if (commentObject.replyingTo)
    commentNode.querySelector(".reply-to").textContent =
      "@" + commentObject.replyingTo;


      if (commentObject.user.username == data.currentUser.username) {
    commentNode.querySelector(".comment").classList.add("this-user");
    commentNode.querySelector(".delete").addEventListener("click", () => {
      promptDel(commentObject);
    });
    return commentNode;
  }
  return commentNode;
};

const appendComment = (parentNode, commentNode, parentId) => {
  const bu_reply = commentNode.querySelector(".reply");
  // parentNode.appendChild(commentNode);
  const appendedCmnt = appendFrag(commentNode, parentNode);
  const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
  bu_reply.addEventListener("click", () => {
    if (parentNode.classList.contains("replies")) {
      spawnReplyInput(parentNode, parentId, replyTo);
    } else {
      //console.log(appendedCmnt.querySelector(".replies"));
      spawnReplyInput(
        appendedCmnt.querySelector(".replies"),
        parentId,
        replyTo
      );
    }
  });
};

function initComments(
  commentList = data.comments,
  parent = document.querySelector(".comments-wrp")
) {
  parent.innerHTML = "";
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector(".replies"));
    }
    appendComment(parent, comment_node, parentId);
  });
}

initComments();
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
  let commentBody = cmntInput.querySelector(".cmnt-input").value;
  if (commentBody.length == 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector(".cmnt-input").value = "";
});
