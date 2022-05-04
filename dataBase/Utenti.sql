CREATE TABLE IF NOT EXISTS `Utenti` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` text NOT NULL,
  `UserName` text NOT NULL,
  `uPassword` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=52;

INSERT INTO `Utenti` (`Id`, `Email`, `UserName`, `uPassword`) VALUES
(1, 'lorenzotelo03@gmail.com', 'lorenzoTelo03', '38fe60b5ba919196840f0a59f28b59323688e3dd38242e1503cc2b282cf516fa'),
(51, '2', '2', 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35');
