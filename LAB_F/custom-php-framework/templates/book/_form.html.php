<?php
    /** @var $book ?\App\Model\Book */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="book[title]" value="<?= $book ? $book->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="author">Author</label>
    <textarea id="author" name="book[author]"><?= $book? $book->getAuthor() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
