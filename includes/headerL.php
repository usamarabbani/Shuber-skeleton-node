<!DOCTYPE html>
<html lang="en">

<head>

<style>
    html, body{
      min-height: 100%;
    }
    body{
      position: relative;
    }
    .overlay{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0,0,0,0.5);
      display: none;
    }
    .modal {
     position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 11;
      background-color: rgba(0,0,0,0.5);
      display: none;
}
</style>



    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="theme-color" content="#1e1e35">

    <!-- never cache patterns -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">


    <title>Speed Rider</title>

    <!-- Bootstrap Core CSS -->
    <link href="/css/styleguide.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="/css/style.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">

    <!-- jQuery -->
    <script src="/js/jquery-1.12.3.min.js"></script>
    <script src="/js/header.js"></script>
    <script type="text/javascript" src="/js/modernizr.custom.86080.js"></script>




    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]-->
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    
<?php

    if(!isset($_SESSION)){
    session_start();
    }
    if(!isset($_SESSION['userLogged']) || empty($_SESSION['userLogged'])) {
        header('Location:../php/login.php#tologin');
        exit;
    } else {
        session_start();
        $UserInf = $_SESSION['userLogged'];
    
}?>
</head>

<body>

<div class="overlay"></div>
<div class="modal">
    <img src="/img/loading.gif" alt="Loading" style="position: absolute; top: 50%; left: 45%; margin-left: -(128/2)px; margin-top: -(38/2)px";>
</div>
<!-- Navigation Bar -->
<div class = "navbartop">
    
    <a href="/index.php"><img src="/img/logowhite.png" class="logo" alt="SpeedRider"></a>
    <ul class = "navattop">
        <li><?php echo '<a id = "login-trigger">Welcome <b>'.$UserInf->FNAME.'</b><span>▲</span>:</a>' ?>
            <div id="login-content">
                <a href="./logout.php">Logout</a>
            </div>
            
        </li>
        <li><a href="../index.html">Home</a></li>
        <li><a href="">About</a>

        </li>

        <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="nav-toggle nav-toggle-menu">
        <a id="menu-toggle" href="#" class="btn btn-teal btn-lg toggle"><i class="fa fa-bars"></i></a>
        <nav id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <a id="menu-close" href="#" class="btn btn-light btn-lg pull-right toggle"><i class="fa fa-times"></i></a>
                <li class="sidebar-brand">
                    <?php echo '<a href="../php/login.php" onclick = $("#login-content").click();>'.$UserInf->FNAME.'\'s Account</a>'?>

                </li>
                <li>
                    <a href="./index.html"  onclick = $("#menu-close").click(); >Speed Rider</a>
                </li>
                <li>
                    <a href="../php/logout.php" onclick = $("#menu-close").click(); >Logout</a>
                </li>

            </ul>
        </nav>
    </div>
    <!-- ./nav-toggle...-->
</div>
<!-- ./navbartop...-->

<script>$('.navbartop').lockedheader({ scrollPoint: 32  });</script>



