---
---

let data = [
  {% for post in site.posts %}
    {
      "title": "{{ post.title }}",
      "categories": "{{ post.categories }}",
      "word-count": countWords("{{ post.content }}"),
      "url": "{{ post.url }}"
    }
    {% unless forloop.last %},{% endunless %}
  {% endfor %}
];

// https://stackoverflow.com/questions/18679576/counting-words-in-string
function countWords(str) {
  var matches = str.match(/[\w\d’'-]+/gi);
  return matches ? matches.length : 0;
}
