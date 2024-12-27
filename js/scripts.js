let parentCommentId = null;
let postId = null;
const postType = window.location.pathname.includes('news') ? 'news' : 'blog';

const redirect = (e, link) => {
  e.preventDefault();
  const id = link.dataset.postId;
  const href = link.href;
  localStorage.setItem('postId', id);
  window.open(href, "_self");
}
const getDeclination = (number) => {
  const lastN = String(number).slice(-1);
  return lastN === '0' || (number > 10 && number < 20) ? 'комментариев' : lastN === '1' ? 'комментарий' : ['2', '3', '4'].includes(lastN) ? 'комментария' : 'комментариев';
}
const getBlogPost = (post) => {
  return `<div class="container">
          <div class="row">
            <div class="col-12">
              <div class="br news__item">
                <div class="news__item__img" style="text-align: center;">
                  <img src="${post.cover}" alt="Книги на полке">
                  <img class="absolute desktop sky sky_1" src="img/sky_1.png" alt="Облака">
                  <img class="absolute desktop sky sky_2" src="img/sky_2.png" alt="Облака">
                </div>
                <div class="fd-c jc-sb news__item__content">
                  <div>
                    <div class="mb-5 flex jc-sb ai-c fd-cr_mob jc-fs_mob ai-fs_mob">
                      <div class="flex ai-c fd-cr_mob ai-fs_mob">
                        <h1>
                          ${post.title}
                        </h1>
                        <ul class="flex ai-c fw-w mb-md-0 mb-4">
                          <li class="btn__item">
                            <button class="btn_active">
                              Статья
                            </button>
                          </li>
                          <li class="btn__item">
                            <button class="btn_active">
                              Блог
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div class="mb-md-0 mb-3 flex fd-c ai-fe fd-r_mob jc-sb_mob ai-c_mob w-100_mob">
                        <div class="news__item__autor">
                          Евгения Лопес
                        </div>
                        <div class="news__item__date">
                          ${dayjs(post.created).format('DD MMM YYYY HH:mm')}
                        </div>
                      </div>
                    </div>
                    <p class="blog__item__descr">
                     ${post.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
}
const getNewsPost = (post) => {
  const tags = post.tags.map(tag => `<li class="btn__item"><button class="btn_active">${tag.name}</button></li>`).join(" ");

  return `
    <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="br news__item">
              <div class="news__item__img" style="text-align: center;">
                <img src="${post.cover}" alt="Книги на полке">
                <img class="absolute desktop sky sky_1" src="img/sky_1.png" alt="Облака">
                <img class="absolute desktop sky sky_2" src="img/sky_2.png" alt="Облака">
              </div>
              <div class="fd-c jc-sb news__item__content">
                <div>
                  <div class="mb-5 flex jc-sb ai-c fd-cr_mob jc-fs_mob ai-fs_mob">
                    <div class="flex ai-c fd-cr_mob ai-fs_mob">
                      <h1>
                        ${post.title}
                      </h1>
                      <ul class="flex ai-c fw-w mb-md-0 mb-4">${tags}</ul>
                    </div>
                    <div class="mb-md-0 mb-3 flex fd-c ai-fe fd-r_mob jc-sb_mob ai-c_mob w-100_mob">
                      <div class="news__item__autor">
                        Евгения Лопес
                      </div>
                      <div class="news__item__date">
                      ${dayjs(post.created).format('DD MMM YYYY HH:mm')}
                      </div>
                    </div>
                  </div>
                    <p class="blog__item__descr">
                     ${post.content}
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
}
const getComment = (comment) => {
  const value = setCommentIdInLS(comment.id);

  return `<div class="mb-5 col-12 comment__container comment-${comment.parentId}" id="comment-${comment.id}">
              <div class="mb-4 flex">
                <svg class="comment__user-pic" width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32.5" cy="32.5" r="32.5" fill="#5D5FEF"/>
                  <text x="50%" y="50%" text-anchor="middle" stroke="#fff" stroke-width="2px" dy=".3em"></text>
                </svg>
                <div class="flex fd-c">
                  <p class="comment__name">
                    ${comment.username}
                  </p>
                  <p class="comment__date">
                    ${dayjs(comment.createdAt).format('DD MMM YYYY HH:mm')}
                  </p>
                </div>
              </div>
              <p class="comment__descr">
                ${comment.content}
              </p>
              <div class="flex jc-sb ai-c fw-w" style="max-width: 800px">
                <div class="flex ai-c mb-md-0 mb-3">
                  <div class="flex ai-c comment__like">
                    <svg id="like" data-comment-id="${comment.id}" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M41.5266 25.0173C42.3141 23.9766 42.75 22.7016 42.75 21.3751C42.75 19.2704 41.5734 17.2782 39.6797 16.1673C39.1922 15.8813 38.6371 15.7308 38.0719 15.7313H26.8313L27.1125 9.9704C27.1781 8.57821 26.6859 7.25633 25.7297 6.24852C25.2604 5.75178 24.6942 5.35655 24.0662 5.08726C23.4381 4.81798 22.7615 4.68035 22.0781 4.6829C19.6406 4.6829 17.4844 6.32352 16.8375 8.67196L12.8109 23.2501H12.7969V43.3126H34.9359C35.3672 43.3126 35.7891 43.2282 36.1781 43.0595C38.4094 42.1079 39.8484 39.9282 39.8484 37.5095C39.8484 36.9188 39.7641 36.3376 39.5953 35.7751C40.3828 34.7345 40.8187 33.4595 40.8187 32.1329C40.8187 31.5423 40.7344 30.961 40.5656 30.3985C41.3531 29.3579 41.7891 28.0829 41.7891 26.7563C41.7797 26.1657 41.6953 25.5798 41.5266 25.0173ZM5.25 24.7501V41.8126C5.25 42.6423 5.92031 43.3126 6.75 43.3126H9.79688V23.2501H6.75C5.92031 23.2501 5.25 23.9204 5.25 24.7501Z"
                       fill="${value.like ? '#F1EDED' : '#8C8596'}"/>
                    </svg>
                    <p>
                      ${comment.likes + (value.like ? 1 : 0)}
                    </p>
                  </div>
                  <div class="flex ai-c comment__like">
                    <svg id="dislike" data-comment-id="${comment.id}" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M41.5266 22.9828C41.6953 22.4203 41.7797 21.8391 41.7797 21.2484C41.7797 19.9219 41.3438 18.6469 40.5563 17.6063C40.725 17.0438 40.8094 16.4625 40.8094 15.8719C40.8094 14.5453 40.3734 13.2703 39.5859 12.2297C39.7547 11.6672 39.8391 11.0859 39.8391 10.4953C39.8391 8.07656 38.4 5.89687 36.1687 4.94531C35.7766 4.77623 35.3536 4.69005 34.9266 4.69219H12.7969V24.7547H12.8109L16.8328 39.3234C17.4797 41.6719 19.6359 43.3125 22.0734 43.3125C23.4656 43.3125 24.7641 42.7594 25.725 41.7469C26.6859 40.7391 27.1781 39.4172 27.1078 38.025L26.8266 32.2641H38.0719C38.6391 32.2641 39.1922 32.1141 39.6797 31.8281C41.5734 30.7266 42.75 28.7297 42.75 26.625C42.75 25.2984 42.3141 24.0234 41.5266 22.9828ZM5.25 6.1875V23.25C5.25 24.0797 5.92031 24.75 6.75 24.75H9.79688V4.6875H6.75C5.92031 4.6875 5.25 5.35781 5.25 6.1875Z"
                      fill="${value.dislike ? '#F1EDED' : '#8C8596'}"/>
                    </svg>
                    <p>
                      ${comment.dislikes + (value.dislike ? 1 : 0)}
                    </p>
                  </div>
                </div>
                <button id="replyButton" data-comment-id="${comment.id}" class="mb-md-0 mb-3">
                  Ответить
                </button>
              </div>
            </div>`
}
const setCommentIdInLS = (id, value) => {
  const comments = localStorage.getItem('comments');
  const bd = comments ? JSON.parse(comments) : {};
  if (!bd[id]) bd[id] = {like: false, dislike: false};
  if (!!value) bd[id] = value;
  localStorage.setItem('comments', JSON.stringify(bd));
  return bd[id];
}
const getPostOnLoad = () => {
  postId = localStorage.getItem('postId');
  const url = postType === 'news' ?
    `json\\NewsPost${postId}.json` :
    `json\\BlogPost${postId}.json`;

  fetch(url)
    .then(res => res.json())
    .then(post => {
      document.getElementById('breadcrumb').innerHTML = post.title;
      document.getElementById('post').innerHTML = postType === 'news' ? getNewsPost(post) : getBlogPost(post);
      return post;
    })
    .then(post => {
      const commentsBody = document.getElementById('comments');
      commentsBody.innerHTML = `<h2 class="comment__title">${post.comments.length} ${getDeclination(post.comments.length)}</h2>`

      const getPosition = (com, i) => {
        if (com.parentId === null) {
          return i;
        }
        const parent = post.comments.find(c => c.id === com.parentId);
        return getPosition(parent, i + 1);
      };

      const map = {}
      post.comments.forEach(c => {
        map[c.id] = [];
      })
      post.comments.forEach(c => {
        if (c.parentId !== null) {
          map[c.parentId] = [...map[c.parentId], c.id];
        }
      })

      const sorted = []

      const push = (id) => {
        if (sorted.findIndex(s => s.id === id) !== -1) {
          return;
        }
        const comment = post.comments.find(c => c.id === id);
        sorted.push(comment);
        map[id].forEach(childId => push(childId));
      };
      for (const key in map) {
        push(+key);
      }

      sorted.forEach(c => {
        const position = getPosition(c, 1);

        let template = getComment(c)
        template = new DOMParser().parseFromString(template, 'text/html').body.firstChild;
        template.style.marginLeft = `${position * 3}rem`;
        const text = template.getElementsByTagName('text')[0];
        const symbol = c.username[0];
        text.insertAdjacentHTML('beforeend', symbol);
        commentsBody.insertAdjacentElement('beforeend', template);
      })
    }).then(() => {
    const replyButtons = document.querySelectorAll('#replyButton');
    replyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        parentCommentId = btn.dataset.commentId;
        const form = document.getElementById('commentForm');
        form.scrollIntoView();
      })
    })

    const likes = document.querySelectorAll('#like');
    const dislikes = document.querySelectorAll('#dislike');
    [...likes, ...dislikes].forEach(btn => btn.addEventListener('click', (e) => likeOrDislike(e, btn)));
  })
}
const sendComment = () => {
  const form = document.getElementById('commentForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const comment = formData.get('comment');
    // const parentId = parentCommentId; 
    // const key = `${postType}PostId`; 
    // const value = { // Uncomment if needed
    //   username: name,
    //   content: comment,
    //   parentId,
    //   [key]: postId,
    // };

    var nameInput = document.querySelector('input[name="name"]');
    var nameValue = nameInput.value;
    var namePattern = /^[a-zA-Zа-яА-ЯёЁ\s]{2,}$/;

    var isValid = true;
    
    if (!namePattern.test(nameValue)) {
        alert('Пожалуйста, введите корректное имя (минимум 2 символа и только буквы).');
        isValid = false;
    }

    if (postType === 'blog') {
      const email = formData.get('email');

      var emailInput = document.querySelector('input[name="email"]');
      var emailValue = emailInput.value;
      var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(emailValue)) {
        alert('Пожалуйста, введите корректный адрес электронной почты.');
        isValid = false;
      }

      if (isValid) {
        alert(`Имя: ${name}\nПочта: ${email}\nКомментарий: ${comment}`);
        form.reset();
      }
    }

    if (!isValid) {
      e.preventDefault();
    }

    if (isValid && postType === 'news') {
      // Display alert with comment information
      alert(`Имя: ${name}\nКомментарий: ${comment}`);
      form.reset();
      /*
      try {
        await fetch('http://158.160.45.17:5010/Comment', {
          method: 'POST',
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value)
        });
      } catch (err) {
        console.log(err);
      } finally {
        form.reset();
        location.reload();
      }
      */
    }
  })
}
const likeOrDislike = async (e, btn) => {
  e.preventDefault();
  const id = btn.dataset.commentId;
  const bd = JSON.parse(localStorage.getItem('comments'));
  const type = btn.id;
  const isChecked = bd[id][type];

  // const getAction = (t, c) => t === 'like' ? c ? 'RemoveLike' : 'SetLike' : c ? 'RemoveDislike' : 'SetDislike';
  // const action = getAction(type, isChecked);
  // const url = `http://158.160.45.17:5010/Comment/${action}/${id}`;

  const oppositeType = type === 'like' ? 'dislike' : 'like';
  const isOppositeChecked = bd[id][oppositeType];

  try {
    // await fetch(url, {method: 'PUT'});

    //if (!isChecked && isOppositeChecked) {
      // const action2 = getAction(oppositeType, isOppositeChecked);
      // const url2 = `http://158.160.45.17:5010/Comment/${action2}/${id}`;
      // await fetch(url2, {method: 'PUT'});
    //}
    const value = type === 'like' ?
      isChecked ? {like: false, dislike: false} : {like: true, dislike: false} :
      isChecked ? {like: false, dislike: false} : {like: false, dislike: true};

    setCommentIdInLS(id, value);
    getPostOnLoad();
  } catch (err) {
    console.log(err);
  }
}


const postsWithTagsType = window.location.pathname.includes('news') ? 'news' : 'poems';
const getTagsHTML = (id, name) => {
  const poems = `<li class="btn__item mb-md-0 mb-2 poem__filter"><button id="filterBtn" data-tag-id="${id}">${name}</button></li>`;
  const news = `<li class="btn__item"><button id="filterBtn" data-tag-id="${id}">${name}</button></li>`
  return postsWithTagsType === 'news' ? news : poems;
}
const getPoemsHTML = (poem) => {
  return `<div class="poem__item poem__item_one">
                <ul class="flex ai-c fw-w">
                    ${poem.tags.map(tag => `<li class="btn__item mb-md-0 mb-2 poem__filter">
                        <button data-tag-id="${tag.id}" class="btn_active">
                          ${tag.name}
                        </button>
                    </li>`).join(" ")}
                </ul>

                <h2 class="mt-2 mb-5">
                  ${poem.title}
                </h2>
                    ${poem.content.split("\r").reduce((acc, text) => {
    if (text === "\n") return [...acc, []];
    acc.at(-1).push(text)
    return acc;
  }, [[]]).map(text => `<p class="poem__p">${text.join("</br>")}</p>`).join(" ")}
              </div>`
}
const getNewsHTML = (post) => {
  return `<li class="mb-4 br news__item news__item_1">
              <a id="news-link" data-post-id="${post.id}" href="news_card.html">
                <div class="row">
                  <div class="col-md-5 col-12 pr-0 desktop">
                    <img class="img-fluid w-100" src="${post.cover}" alt="Романы на полке">
                  </div>
                  <div class="col-md-7 col-12 pl-0">
                    <div class="flex fd-c jc-sb news__item__content">
                      <div class="mb-4">
                        <div class="mb-5 flex jc-sb ai-c fd-cr_mob jc-fs_mob ai-fs_mob">
                          <ul class="flex ai-c fw-w">
                            ${post.tags.map(tag => `<li class="btn__item mb-md-0 mb-2">
                              <button data-tag-id="${tag.id}" class="btn_active">
                                ${tag.name}
                              </button>
                            </li>`).join(" ")}
                          </ul>
                          <div class="mb-md-0 mb-3 flex fd-c ai-fe fd-r_mob jc-sb_mob ai-c_mob w-100_mob">
                            <div class="news__item__autor">
                              Евгения Лопес
                            </div>
                            <div class="news__item__date">
                               ${dayjs(post.created).format('DD MMM YYYY HH:mm')}
                            </div>
                          </div>
                        </div>
                        <h2 class="news__item__title">${post.title}</h2>
                        <p class="news__item__descr">${post.content}</p>
                      </div>
                      <div class="flex jc-sb ai-c">
                        <div class="flex ai-c news__item__comment-container">
                          <svg class="news__item__comment-icon" width="31" height="29" viewBox="0 0 31 29" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="15.5" cy="12.4" rx="15.5" ry="12.4" fill="#8C8596"/>
                            <path
                              d="M5.52705 26.0906C4.86038 26.4755 4.02705 25.9944 4.02705 25.2246L4.02705 20.6347C4.02705 19.8649 4.86038 19.3838 5.52705 19.7687L9.50205 22.0636C10.1687 22.4485 10.1687 23.4108 9.50205 23.7957L5.52705 26.0906Z"
                              fill="#8C8596"/>
                          </svg>
                          <p class="mulish news__item__comment-link">
                            ${post.commentsCount} ${getDeclination(post.commentsCount)}
                          </p>
                        </div>
                        <div>
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <line x1="19.7989" y1="2.82843" x2="36.7694" y2="19.799" stroke="#D73B78" stroke-width="4"
                                  stroke-linecap="round"/>
                            <line x1="19.7988" y1="36.7696" x2="36.7694" y2="19.799" stroke="#D73B78" stroke-width="4"
                                  stroke-linecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>`
}
const getContentByTag = (tagId) => {
  const url = postsWithTagsType === 'news' ?
    !!tagId ? `http://158.160.45.17:5010/NewsPost/GetNewsByTagId/${tagId}` : 'json\\NewsPosts.json' :
    !!tagId ? `http://158.160.45.17:5010/api/Poem/GetPoemsByTagId/${tagId}` : 'json\\Poems.json';

  fetch(url)
    .then(res => res.json())
    .then(posts => {
      document.getElementById("content-container").innerHTML = posts.map(post => {
        return postsWithTagsType === 'news' ? getNewsHTML(post) : getPoemsHTML(post);
      }).join(" ")
      if (postsWithTagsType === 'news') {
        const posts = document.querySelectorAll('#news-link');
        posts.forEach(i => i.addEventListener('click', (event) => redirect(event, i)));
      }
    })
}
const clearTags = () => {
  const tags = document.querySelectorAll('#filterBtn');
  tags.forEach(t => t.classList.remove('btn_active'));
  // document.querySelector('.btn_active').classList.remove('btn_active')
};
const getTags = () => {
  const url = postsWithTagsType === 'news' ?
    'json\\NewsTags.json' :
    'json\\PoemTags.json';

  fetch(url)
    .then(res => res.json())
    .then(tags => {
      const tagsContainer = document.getElementById('tags');
      tagsContainer.innerHTML = tags.map(({id, name}) => getTagsHTML(id, name)).join(" ");
      tagsContainer.querySelectorAll('#filterBtn').forEach(btn => {
        btn.addEventListener('click', (e) => getById(e, btn));
      })
    })
}
const getById = (e, btn) => {
  e.preventDefault();
  clearTags();
  const id = btn.dataset.tagId;
  btn.classList.add('btn_active');
  getContentByTag(id);
}
const getTagsAndContent = async () => {
  await getTags();
  getContentByTag();
  clearTags();
}

