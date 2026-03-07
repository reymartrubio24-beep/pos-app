<?php
require_once '../utils/common.php';

session_destroy();
sendResponse(['success' => true]);
