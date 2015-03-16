(function ( $ ) {
 	
    $.fn.vndisCalendar = function( options ) {
        return this.each(function() {
        	return new Calendar(this,options);
    	});
    };
    var Calendar = function(element, options){
    	this.init(element,options);
    };
    Calendar.prototype.init = function(element, options)
    {

    	this.initVariable();
    	this.defaults = $.extend({}, this.defaults, options);
    	if(element != '' && element != 'undefined')
    	{
    		this.element = element;
    	}
    	if( ! $(this.element).length)
    	{
    		$('body').append(this.element);
    	}
    	this.show();
    }
    Calendar.prototype.bindEvent = function()
    {
    	var self = this;
    	//$('.'+self.defaults.classItem).on('click', function(e){ title = $(this).attr('title');$.alert(title); });
    	$('.'+self.defaults.getCalendar).on('click', function(e){month = parseInt($(this).attr('data-month'));year = parseInt($(this).attr('data-year')); self.goToMonth(month, year);} );
    }
    Calendar.prototype.show = function()
    {
    	this.showToday();
    	this.bindEvent();
    }
    Calendar.prototype.getToday = function() 
	{
		var today = new Date();
		return new Array(today.getDate(),today.getMonth(),today.getFullYear());
	}
	Calendar.prototype.showMonth = function(month, year) 
	{
		var table = this.getList(month, year);
		var res = "";
		res += "<div class='" + this.defaults.className +"'>";
		res += table;
		res += "</div>";
		return res;
	}
	Calendar.prototype.getList = function(month, year) 
	{
		var i, j, k, solar, lunar, cellClass, solarClass, lunarClass;
		var lunarMonth = this.getMonth(month, year);
		if (lunarMonth.length == 0) return;
		var ld1 = lunarMonth[0];
		var emptyCells = (ld1.julianDate + 1) % 7;
		var MonthHead = month + "/" + year;
		var LunarHead = this.getYearCanChi(ld1.year);
		var res = '';
		res += (this.defaults.elementStyle==1) ? ('<ul>') : '<table>';
		res += (this.defaults.elementStyle==1) ? this.getUlHead(month, year) : this.getTbHead(month, year);
		for (i = 0; i < 6; i++) 
		{
			res += (this.defaults.elementStyle==1) ? ('<li class="row"><ul>') : '<tr>';
			for (j = 0; j < 7; j++)
			{
				k = 7 * i + j;
				if (k < emptyCells || k >= emptyCells + lunarMonth.length) 
				{
					res += (this.defaults.elementStyle==1) ? this.getUlEmptyCell() : this.getTbEmptyCell();;
				} 
				else 
				{
					solar = k - emptyCells + 1;
					ld1 = lunarMonth[k - emptyCells];
					res += (this.defaults.elementStyle==1) ? this.getUlCell(ld1, solar, month, year) : this.getTbCell(ld1, solar, month, year);
				}
			}
			res += (this.defaults.elementStyle==1) ? ('</ul></li>') : '</tr>';
		}
		res += (this.defaults.elementStyle==1) ? ('</ul>') : '</table>';
		return res;
	}
	
	Calendar.prototype.getMonth=function(mm, yy)
	{
		var ly1, ly2, newyearday, julianDate1, julianDate2, mm1, yy1, result, i;
		if (mm < 12) 
		{
			mm1 = mm + 1;
			yy1 = yy;
		} 
		else 
		{
			mm1 = 1;
			yy1 = yy + 1;
		}
		julianDate1 = this.julianDaten(1, mm, yy);
		julianDate2 = this.julianDaten(1, mm1, yy1);
		ly1 = this.getYearInfo(yy);
		//alert('1/'+mm+'/'+yy+' = '+julianDate1+'; 1/'+mm1+'/'+yy1+' = '+julianDate2);
		newyearday = ly1[0].julianDate;
		result = new Array();
		if (newyearday <= julianDate1) 
		{ 
			/* new-year-day(yy) = new-year-day1 < julianDate1 < julianDate2 <= 1.1.(yy+1) < new-year-day(yy+1) */
			for (i = julianDate1; i < julianDate2; i++) 
			{
				result.push(this.findLunarDate(i, ly1));
			}
		} 
		else if (julianDate1 < newyearday && julianDate2 < newyearday) 
		{ 
			/* new-year-day(yy-1) < julianDate1 < julianDate2 < new-year-day1 = new-year-day(yy) */
			ly1 = this.getYearInfo(yy - 1);
			for (i = julianDate1; i < julianDate2; i++) 
			{
				result.push(this.findLunarDate(i, ly1));
			}
		} 
		else if (julianDate1 < newyearday && newyearday <= julianDate2)
		{ 
			/* new-year-day(yy-1) < julianDate1 < new-year-day1 <= julianDate2 < new-year-day(yy+1) */
			ly2 = this.getYearInfo(yy - 1);
			for (i = julianDate1; i < newyearday; i++) 
			{
				result.push(this.findLunarDate(i, ly2));
			}
			for (i = newyearday; i < julianDate2; i++) 
			{
				result.push(this.findLunarDate(i, ly1));
			}
		}
		return result;
	}
	Calendar.prototype.julianDaten = function(dd, mm, yy)
	{
		var a = this.interger((14 - mm) / 12);
		var y = yy+4800-a;
		var m = mm+12*a-3;
		var julianDate = dd + this.interger((153*m+2)/5) + 365*y + this.interger(y/4) - this.interger(y/100) + this.interger(y/400) - 32045;
		return julianDate;
	}
	Calendar.prototype.getYearInfo = function(yyyy) 
	{
		var yearCode;
		if (yyyy < 1900) 
		{
			yearCode = this.CENTURY_19[yyyy - 1800];
		} 
		else if (yyyy < 2000) 
		{
			yearCode = this.CENTURY_20[yyyy - 1900];
		} 
		else if (yyyy < 2100) 
		{
			yearCode = this.CENTURY_21[yyyy - 2000];
		} 
		else 
		{
			yearCode = this.CENTURY_22[yyyy - 2100];
		}
		return this.decodeLunarYear(yyyy, yearCode);
	}
	Calendar.prototype.decodeLunarYear = function(yy, k) 
	{
		var monthLengths, regularMonths, offsetOfnewyearday, leapMonth, leapMonthLength, solarNY, currentjulianDate, j, mm;
		var ly = new Array();
		monthLengths = new Array(29, 30);
		regularMonths = new Array(12);
		offsetOfnewyearday = k >> 17;
		leapMonth = k & 0xf;
		leapMonthLength = monthLengths[k >> 16 & 0x1];
		solarNY = this.julianDaten(1, 1, yy);
		currentjulianDate = solarNY+offsetOfnewyearday;
		j = k >> 4;
		for(i = 0; i < 12; i++) 
		{
			regularMonths[12 - i - 1] = monthLengths[j & 0x1];
			j >>= 1;
		}
		if (leapMonth == 0) 
		{
			for(mm = 1; mm <= 12; mm++) 
			{
				ly.push(new this.LunarDate(1, mm, yy, 0, currentjulianDate));
				currentjulianDate += regularMonths[mm-1];
			}
		} 
		else 
		{
			for(mm = 1; mm <= leapMonth; mm++) 
			{
				ly.push(new this.LunarDate(1, mm, yy, 0, currentjulianDate));
				currentjulianDate += regularMonths[mm-1];
			}
			ly.push(new this.LunarDate(1, leapMonth, yy, 1, currentjulianDate));
			currentjulianDate += leapMonthLength;
			for(mm = leapMonth+1; mm <= 12; mm++) 
			{
				ly.push(new this.LunarDate(1, mm, yy, 0, currentjulianDate));
				currentjulianDate += regularMonths[mm-1];
			}
		}
		return ly;
	}
	/* Create lunar date object, stores (lunar) date, month, year, leap month indicator, and Julian date number */
	Calendar.prototype.LunarDate = function(dd, mm, yy, leap, julianDate) 
	{
		this.day = dd;
		this.month = mm;
		this.year = yy;
		this.leap = leap;
		this.julianDate = julianDate;
	}
	/* Discard the fractional part of a number, e.g., interger(3.2) = 3 */
	Calendar.prototype.interger = function(d) 
	{
		return Math.floor(d);
	}
	Calendar.prototype.julianDaten2date = function(julianDate) 
	{
		var Z, A, alpha, B, C, D, E, dd, mm, yyyy, F;
		Z = julianDate;
		if (Z < 2299161) 
		{
		  A = Z;
		} 
		else 
		{
		  alpha = this.interger((Z-1867216.25)/36524.25);
		  A = Z + 1 + alpha - this.interger(alpha/4);
		}
		B = A + 1524;
		C = this.interger( (B-122.1)/365.25);
		D = this.interger( 365.25*C );
		E = this.interger( (B-D)/30.6001 );
		dd = this.interger(B - D - this.interger(30.6001*E));
		if (E < 14) 
		{
		  mm = E - 1;
		} 
		else 
		{
		  mm = E - 13;
		}
		if (mm < 3) 
		{
		  yyyy = C - 4715;
		} 
		else 
		{
		  yyyy = C - 4716;
		}
		return new Array(dd, mm, yyyy);
	}
	Calendar.prototype.findLunarDate = function(julianDate, ly) 
	{
		var FIRST_DAY = this.julianDaten(25, 1, 1800); // new-year-day lunar lich 1800
		var LAST_DAY = this.julianDaten(31, 12, 2199);
		if (julianDate > LAST_DAY || julianDate < FIRST_DAY || ly[0].julianDate > julianDate) 
		{
			return new LunarDate(0, 0, 0, 0, julianDate);
		}
		var i = ly.length-1;
		while (julianDate < ly[i].julianDate) 
		{
			i--;
		}
		var off = julianDate - ly[i].julianDate;
		ret = new this.LunarDate(ly[i].day+off, ly[i].month, ly[i].year, ly[i].leap, julianDate);
		return ret;
	}
	Calendar.prototype.getLunarDate = function(dd, mm, yyyy) 
	{
		var ly, julianDate;
		if (yyyy < 1800 || 2199 < yyyy) 
		{
			return new LunarDate(0, 0, 0, 0, 0);
		}
		ly = getYearInfo(yyyy);
		julianDate = julianDaten(dd, mm, yyyy);
		if (julianDate < ly[0].julianDate) 
		{
			ly = getYearInfo(yyyy - 1);
		}
		return findLunarDate(julianDate, ly);
	}

	/* Compute the longitude of the sun at any time.
	 * Parlunareter: floating number julianDaten, the number of days since 1/1/4713 BC noon
	 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
	 */
	Calendar.prototype.SunLongitude = function(julianDaten) 
	{
		var T, T2, dr, M, L0, DL, llunarbda, theta, omega;
		T = (julianDaten - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
		T2 = T*T;
		dr = this.PI/180; // degree to radian
		M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
		L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
		DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
		DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
	    theta = L0 + DL; // true longitude, degree
	    // obtain apparent longitude by correcting for nutation and aberration
	    omega = 125.04 - 1934.136 * T;
	    llunarbda = theta - 0.00569 - 0.00478 * Math.sin(omega * dr);
	    // Convert to radians
	    llunarbda = llunarbda*dr;
		llunarbda = llunarbda - this.PI*2*(this.interger(llunarbda/(this.PI*2))); // Normalize to (0, 2*PI)
	    return llunarbda;
	}

	/* Compute the sun segment at start (00:00) of the day with the given intergeregral Julian day number.
	 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
	 * The function returns a number between 0 and 23.
	 * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
	 * After that, return 1, 2, 3 ...
	 */
	Calendar.prototype.getSunLongitude = function(dayNumber, timeZone) 
	{
		return this.interger(this.SunLongitude(dayNumber - 0.5 - timeZone/24.0) / this.PI * 12);
	}

	Calendar.prototype.getDayName=function(lunarDate) 
	{
		if (lunarDate.day == 0) 
		{
			return "";
		}
		var cc = this.getCanChi(lunarDate);
		var s = "Ng\u00E0y " + cc[0] +", th\341ng "+cc[1] + ", n\u0103m " + cc[2];
		return s;
	}
	Calendar.prototype.getYearCanChi = function(year) 
	{
		return this.CAN[(year+6) % 10] + " " + this.CHI[(year+8) % 12];
	}

	/*
	 * Can cua gio Chinh Ty (00:00) cua ngay voi julianDateN nay
	 */
	Calendar.prototype.getCanHour=function(julianDaten) 
	{
		return this.CAN[(julianDaten-1)*2 % 10];
	}

	Calendar.prototype.getCanChi = function(lunar) 
	{
		var dayName, monthName, yearName;
		dayName = this.CAN[(lunar.julianDate + 9) % 10] + " " + this.CHI[(lunar.julianDate+1)%12];
		monthName = this.CAN[(lunar.year*12+lunar.month+3) % 10] + " " + this.CHI[(lunar.month+1)%12];
		if (lunar.leap == 1) 
		{
			monthName += " (nhu\u1EADn)";
		}
		yearName = this.getYearCanChi(lunar.year);
		return new Array(dayName, monthName, yearName);
	}

	Calendar.prototype.getDayString = function(lunar, solarDay, solarMonth, solarYear) 
	{
		var s;
		var dayOfWeek = this.WEEK[(lunar.julianDate + 1) % 7];
		s = dayOfWeek + " " + solarDay + "/" + solarMonth + "/" + solarYear;
		s += " -+- ";
		s = s + "Ng\u00E0y " + lunar.day+" th\341ng "+lunar.month;
		if (lunar.leap == 1) 
		{
			s = s + " nhu\u1EADn";
		}
		return s;
	}
	Calendar.prototype.getTodayString = function() 
	{
		var today = new Date();
		var currentLunarDate = this.getLunarDate(today.getDate(), today.getMonth()+1, today.getFullYear());
		var s = this.getDayString(currentLunarDate, today.getDate(), today.getMonth()+1, today.getFullYear());
		s += " n\u0103m " + this.getYearCanChi(currentLunarDate.year);
		return s;
	}

	Calendar.prototype.getCurrentTime = function()
	{
		var today = new Date();
		var Std = today.getHours();
		var Min = today.getMinutes();
		var Sec = today.getSeconds();
		var s1  = ((Std < 10) ? "0" + Std : Std);
		var s2  = ((Min < 10) ? "0" + Min : Min);
		var s3  = ((Sec < 10) ? "0" + Sec : Sec);
		return s1 + ":" + s2 + ":" + s3;
		//return s1 + ":" + s2;
	}
	Calendar.prototype.getGioHoangDao = function(julianDate) 
	{
		var chiOfDay = (julianDate+1) % 12;
		var hour = this.HOUR[chiOfDay % 6];
		var ret = "";
		var count = 0;
		for (var i = 0; i < 12; i++) 
		{
			if (hour.charAt(i) == '1') 
			{
				ret += this.CHI[i];
				ret += ' ('+(i*2+23)%24+'-'+(i*2+1)%24+')';
				if (count++ < 5) ret += ', ';
				if (count == 3) ret += '\n';
			}
		}
		return ret;
	}
	Calendar.prototype.getUlHead = function(mm, yy) 
	{
		var res = "";
		var monthName = mm+"/"+yy;
		var prevMonth = mm > 1 ? mm-1 : 12;
		var prevYear = (yy > 1800 && yy < 2199)  ?  (yy-1) : yy;
		var nextMonth = mm < 12 ? mm + 1 : 1;
	    var nextYear = (yy > 1800 && yy < 2199)  ?  (yy+1) : yy ;
		var prevMiddleYear = (mm == 1) ? (yy-1) : yy;
		var nextMiddleYear = (mm == 12) ? (yy+1) : yy;
		res += ('<li class="head-first"><ul class="head"><li class="'+ this.defaults.classPrevYear+' '+ this.defaults.getCalendar+'" data-month="'+mm+'" data-year="'+prevYear+'">' + this.defaults.prevYearLink + '</li>');
		res += ('<li class="'+ this.defaults.classPrevMonth+' '+ this.defaults.getCalendar+'" data-month="'+prevMonth+'" data-year="'+prevMiddleYear+'">' + this.defaults.prevMonthLink + '</li>');
		res += ('<li class="'+ this.defaults.classMontName+'">'+monthName+'</li>');
		res += ('<li class="'+ this.defaults.classNextMonth+' '+ this.defaults.getCalendar+'" data-month="'+nextMonth+'" data-year="'+nextMiddleYear+'">' + this.defaults.nextMonthLink + '</li>');
	    res += ('<li class="'+ this.defaults.classNextYear+' '+ this.defaults.getCalendar+'" data-month="'+mm+'" data-year="'+nextYear+'">'+this.defaults.nextYearLink+'</li></ul></li>');
		res += ('<li class="head-second"><ul class="head-day">');
		for (var i = 0; i <= 6; i++) 
		{
		    res += ('<li class="ngay-in-week">' + this.DAYINWEEK[i] + '</li>');
		}
		res += ('</ul></li>');
		return res;
	}
	Calendar.prototype.getTbHead = function(mm, yy) 
	{
		var res = "";
		var monthName = mm+"/"+yy;
		var prevMonth = mm > 1 ? mm-1 : 12;
		var prevYear = (yy > 1800 && yy < 2199)  ?  (yy-1) : yy;
		var nextMonth = mm < 12 ? mm + 1 : 1;
	    var nextYear = (yy > 1800 && yy < 2199)  ?  (yy+1) : yy ;
		var prevMiddleYear = (mm == 1) ? (yy-1) : yy;
		var nextMiddleYear = (mm == 12) ? (yy+1) : yy;
		res += ('<tr class="head-first"><td class="'+ this.defaults.classPrevYear+' '+ this.defaults.getCalendar+'" data-month="'+mm+'" data-year="'+prevYear+'">' + this.defaults.prevYearLink + '</td>');
		res += ('<td class="'+ this.defaults.classPrevMonth+' '+ this.defaults.getCalendar+'" data-month="'+prevMonth+'" data-year="'+prevMiddleYear+'">' + this.defaults.prevMonthLink + '</td>');
		res += ('<td colspan="3" class="'+ this.defaults.classMontName+'">'+monthName+'</td>');
		res += ('<td class="'+ this.defaults.classNextMonth+' '+ this.defaults.getCalendar+'" data-month="'+nextMonth+'" data-year="'+nextMiddleYear+'">' + this.defaults.nextMonthLink + '</td>');
	    res += ('<td class="'+ this.defaults.classNextYear+' '+ this.defaults.getCalendar+'" data-month="'+mm+'" data-year="'+nextYear+'">'+this.defaults.nextYearLink+'</td></tr>');
		res += ('<tr class="head-second">');
		for (var i = 0; i <= 6; i++) 
		{
		    res += ('<td class="ngay-in-week">' + this.DAYINWEEK[i] + '</td>');
		}
		res += ('</tr>');
		return res;
	}
	Calendar.prototype.getUlEmptyCell = function() 
	{
			return '<li class="date-empty"><div class="sunday">&nbsp;</div><div class="lunar">&nbsp;</div></li>';
	}
	Calendar.prototype.getTbEmptyCell = function() 
	{
			return '<td class="date-empty"><div class="sunday">&nbsp;</div><div class="lunar">&nbsp;</div></td>';
	}
	Calendar.prototype.getUlCell = function(lunarDate, solarDate, solarMonth, solarYear) 
	{
		var today = new Date();
		var className = this.defaults.classItem + ' col';
		var dow = (lunarDate.julianDate + 1) % 7;
		if (dow == 0) 
		{
			className += " sunday";
		} 
		else if (dow == 6) 
		{
			className += " saturday";
		}
		if (solarDate == today.getDate() && solarMonth == today.getMonth()+1 && solarYear == today.getFullYear() ) 
		{
			className += " today";
		}
		if (lunarDate.day == 1 && lunarDate.month == 1) 
		{
			className += " new-year-day";
		}
		if (lunarDate.leap == 1) 
		{
			className += " lunar2";
		}
		var lunar = lunarDate.day;
		if (solarDate == 1 || lunar == 1) 
		{
			lunar = lunarDate.day + "/" + lunarDate.month;
		}
		var res = "";
		var info = this.getDayInfo(lunarDate.day,lunarDate.month,lunarDate.year,lunarDate.leap,lunarDate.julianDate ,solarDate,solarMonth,solarYear);
		var date = lunarDate.day+','+lunarDate.month+','+lunarDate.year+','+lunarDate.leap+','+lunarDate.julianDate+','+solarDate+','+solarMonth+','+solarYear;
		res += ('<li data-date="'+date+'" class="'+className+'" title="'+ info+'">');
		res += ('<div class="solar">'+solarDate+'</div><div class="lunar">'+lunar+'</div></li>');
		return res;
	}
	Calendar.prototype.getTbCell = function(lunarDate, solarDate, solarMonth, solarYear) 
	{
		var today = new Date();
		var className = this.defaults.classItem + ' col';
		var dow = (lunarDate.julianDate + 1) % 7;
		if (dow == 0) 
		{
			className += " sunday";
		} 
		else if (dow == 6) 
		{
			className += " saturday";
		}
		if (solarDate == today.getDate() && solarMonth == today.getMonth()+1 && solarYear == today.getFullYear() ) 
		{
			className += " today";
		}
		if (lunarDate.day == 1 && lunarDate.month == 1) 
		{
			className += " new-year-day";
		}
		if (lunarDate.leap == 1) 
		{
			className += " lunar2";
		}
		var lunar = lunarDate.day;
		if (solarDate == 1 || lunar == 1) 
		{
			lunar = lunarDate.day + "/" + lunarDate.month;
		}
		var res = "";
		var info = this.getDayInfo(lunarDate.day,lunarDate.month,lunarDate.year,lunarDate.leap,lunarDate.julianDate ,solarDate,solarMonth,solarYear);
		var date = lunarDate.day+','+lunarDate.month+','+lunarDate.year+','+lunarDate.leap+','+lunarDate.julianDate+','+solarDate+','+solarMonth+','+solarYear;
		res += ('<td data-date="'+date+'" class="'+className+'" title="'+ info+'">');
		res += ('<div class="solar">'+solarDate+'</div><div class="lunar">'+lunar+'</div></td>');
		return res;
	}
	// array(dd, mm, yy, leap, julianDate, sday, smonth, syear)
	Calendar.prototype.getDayInfo = function(dd, mm, yy, leap, julianDate, sday, smonth, syear)
	{
		var lunar = new this.LunarDate(dd, mm, yy, leap, julianDate);		
		var s = this.getDayString(lunar, sday, smonth, syear);

		s += " \u00E2m l\u1ECBch\n";
		s += this.getDayName(lunar);
		s += "\nGi\u1EDD \u0111\u1EA7u ng\u00E0y: "+ this.getCanHour(julianDate)+" "+this.CHI[0];
		s += "\nTi\u1EBFt: "+this.TIETKHI[this.getSunLongitude(julianDate+1, 7.0)];
		s += "\nGi\u1EDD ho\u00E0ng \u0111\u1EA1o: "+this.getGioHoangDao(julianDate);
		return s;
	}
	Calendar.prototype.showToday = function() 
	{
		var arr = this.getToday();
		this.goToMonth(arr[1]+1, arr[2]);
	}
	Calendar.prototype.goToMonth = function(month, year) 
	{
		$(this.element).html('');
		$(this.element).html(this.showMonth(month, year));
		this.bindEvent();
	}
	Calendar.prototype.initVariable = function()
	{
		this.VERSION = 'Version 1.0';
		this.CENTURY_19 = new Array(
			0x30baa3, 0x56ab50, 0x422ba0, 0x2cab61, 0x52a370, 0x3c51e8, 0x60d160, 0x4ae4b0, 0x376926, 0x58daa0,
			0x445b50, 0x3116d2, 0x562ae0, 0x3ea2e0, 0x28e2d2, 0x4ec950, 0x38d556, 0x5cb520, 0x46b690, 0x325da4,
			0x5855d0, 0x4225d0, 0x2ca5b3, 0x52a2b0, 0x3da8b7, 0x60a950, 0x4ab4a0, 0x35b2a5, 0x5aad50, 0x4455b0,
			0x302b74, 0x562570, 0x4052f9, 0x6452b0, 0x4e6950, 0x386d56, 0x5e5aa0, 0x46ab50, 0x3256d4, 0x584ae0,
			0x42a570, 0x2d4553, 0x50d2a0, 0x3be8a7, 0x60d550, 0x4a5aa0, 0x34ada5, 0x5a95d0, 0x464ae0, 0x2eaab4,
			0x54a4d0, 0x3ed2b8, 0x64b290, 0x4cb550, 0x385757, 0x5e2da0, 0x4895d0, 0x324d75, 0x5849b0, 0x42a4b0,
			0x2da4b3, 0x506a90, 0x3aad98, 0x606b50, 0x4c2b60, 0x359365, 0x5a9370, 0x464970, 0x306964, 0x52e4a0,
			0x3cea6a, 0x62da90, 0x4e5ad0, 0x392ad6, 0x5e2ae0, 0x4892e0, 0x32cad5, 0x56c950, 0x40d4a0, 0x2bd4a3,
			0x50b690, 0x3a57a7, 0x6055b0, 0x4c25d0, 0x3695b5, 0x5a92b0, 0x44a950, 0x2ed954, 0x54b4a0, 0x3cb550,
			0x286b52, 0x4e55b0, 0x3a2776, 0x5e2570, 0x4852b0, 0x32aaa5, 0x56e950, 0x406aa0, 0x2abaa3, 0x50ab50
		); /* Years 2000-2099 */

		this.CENTURY_20 = new Array(
			0x3c4bd8, 0x624ae0, 0x4ca570, 0x3854d5, 0x5cd260, 0x44d950, 0x315554, 0x5656a0, 0x409ad0, 0x2a55d2,
			0x504ae0, 0x3aa5b6, 0x60a4d0, 0x48d250, 0x33d255, 0x58b540, 0x42d6a0, 0x2cada2, 0x5295b0, 0x3f4977,
			0x644970, 0x4ca4b0, 0x36b4b5, 0x5c6a50, 0x466d50, 0x312b54, 0x562b60, 0x409570, 0x2c52f2, 0x504970,
			0x3a6566, 0x5ed4a0, 0x48ea50, 0x336a95, 0x585ad0, 0x442b60, 0x2f86e3, 0x5292e0, 0x3dc8d7, 0x62c950,
			0x4cd4a0, 0x35d8a6, 0x5ab550, 0x4656a0, 0x31a5b4, 0x5625d0, 0x4092d0, 0x2ad2b2, 0x50a950, 0x38b557,
			0x5e6ca0, 0x48b550, 0x355355, 0x584da0, 0x42a5b0, 0x2f4573, 0x5452b0, 0x3ca9a8, 0x60e950, 0x4c6aa0,
			0x36aea6, 0x5aab50, 0x464b60, 0x30aae4, 0x56a570, 0x405260, 0x28f263, 0x4ed940, 0x38db47, 0x5cd6a0,
			0x4896d0, 0x344dd5, 0x5a4ad0, 0x42a4d0, 0x2cd4b4, 0x52b250, 0x3cd558, 0x60b540, 0x4ab5a0, 0x3755a6,
			0x5c95b0, 0x4649b0, 0x30a974, 0x56a4b0, 0x40aa50, 0x29aa52, 0x4e6d20, 0x39ad47, 0x5eab60, 0x489370,
			0x344af5, 0x5a4970, 0x4464b0, 0x2c74a3, 0x50ea50, 0x3d6a58, 0x6256a0, 0x4aaad0, 0x3696d5, 0x5c92e0
		); /* Years 1900-1999 */

		this.CENTURY_21 = new Array(
			0x46c960, 0x2ed954, 0x54d4a0, 0x3eda50, 0x2a7552, 0x4e56a0, 0x38a7a7, 0x5ea5d0, 0x4a92b0, 0x32aab5,
			0x58a950, 0x42b4a0, 0x2cbaa4, 0x50ad50, 0x3c55d9, 0x624ba0, 0x4ca5b0, 0x375176, 0x5c5270, 0x466930,
			0x307934, 0x546aa0, 0x3ead50, 0x2a5b52, 0x504b60, 0x38a6e6, 0x5ea4e0, 0x48d260, 0x32ea65, 0x56d520,
			0x40daa0, 0x2d56a3, 0x5256d0, 0x3c4afb, 0x6249d0, 0x4ca4d0, 0x37d0b6, 0x5ab250, 0x44b520, 0x2edd25,
			0x54b5a0, 0x3e55d0, 0x2a55b2, 0x5049b0, 0x3aa577, 0x5ea4b0, 0x48aa50, 0x33b255, 0x586d20, 0x40ad60,
			0x2d4b63, 0x525370, 0x3e49e8, 0x60c970, 0x4c54b0, 0x3768a6, 0x5ada50, 0x445aa0, 0x2fa6a4, 0x54aad0,
			0x4052e0, 0x28d2e3, 0x4ec950, 0x38d557, 0x5ed4a0, 0x46d950, 0x325d55, 0x5856a0, 0x42a6d0, 0x2c55d4,
			0x5252b0, 0x3ca9b8, 0x62a930, 0x4ab490, 0x34b6a6, 0x5aad50, 0x4655a0, 0x2eab64, 0x54a570, 0x4052b0,
			0x2ab173, 0x4e6930, 0x386b37, 0x5e6aa0, 0x48ad50, 0x332ad5, 0x582b60, 0x42a570, 0x2e52e4, 0x50d160,
			0x3ae958, 0x60d520, 0x4ada90, 0x355aa6, 0x5a56d0, 0x462ae0, 0x30a9d4, 0x54a2d0, 0x3ed150, 0x28e952
		); /* Years 2000-2099 */

		this.CENTURY_22 = new Array(
				0x4eb520, 0x38d727, 0x5eada0, 0x4a55b0, 0x362db5, 0x5a45b0, 0x44a2b0, 0x2eb2b4, 0x54a950, 0x3cb559,
				0x626b20, 0x4cad50, 0x385766, 0x5c5370, 0x484570, 0x326574, 0x5852b0, 0x406950, 0x2a7953, 0x505aa0,
				0x3baaa7, 0x5ea6d0, 0x4a4ae0, 0x35a2e5, 0x5aa550, 0x42d2a0, 0x2de2a4, 0x52d550, 0x3e5abb, 0x6256a0,
				0x4c96d0, 0x3949b6, 0x5e4ab0, 0x46a8d0, 0x30d4b5, 0x56b290, 0x40b550, 0x2a6d52, 0x504da0, 0x3b9567,
				0x609570, 0x4a49b0, 0x34a975, 0x5a64b0, 0x446a90, 0x2cba94, 0x526b50, 0x3e2b60, 0x28ab61, 0x4c9570,
				0x384ae6, 0x5cd160, 0x46e4a0, 0x2eed25, 0x54da90, 0x405b50, 0x2c36d3, 0x502ae0, 0x3a93d7, 0x6092d0,
				0x4ac950, 0x32d556, 0x58b4a0, 0x42b690, 0x2e5d94, 0x5255b0, 0x3e25fa, 0x6425b0, 0x4e92b0, 0x36aab6,
				0x5c6950, 0x4674a0, 0x31b2a5, 0x54ad50, 0x4055a0, 0x2aab73, 0x522570, 0x3a5377, 0x6052b0, 0x4a6950,
				0x346d56, 0x585aa0, 0x42ab50, 0x2e56d4, 0x544ae0, 0x3ca570, 0x2864d2, 0x4cd260, 0x36eaa6, 0x5ad550,
				0x465aa0, 0x30ada5, 0x5695d0, 0x404ad0, 0x2aa9b3, 0x50a4d0, 0x3ad2b7, 0x5eb250, 0x48b540, 0x33d556
		); /* Years 2100-2199 */

		this.CAN     = new Array("Gi\341p", "\u1EA4t", "B\355nh", "\u0110inh", "M\u1EADu", "K\u1EF7", "Canh", "T\342n", "Nh\342m", "Qu\375");
		this.CHI     = new Array("T\375", "S\u1EEDu", "D\u1EA7n", "M\343o", "Th\354n", "T\u1EF5", "Ng\u1ECD", "M\371i", "Th\342n", "D\u1EADu", "Tu\u1EA5t", "H\u1EE3i");
		this.WEEK    = new Array("Ch\u1EE7 nh\u1EADt", "Th\u1EE9 hai", "Th\u1EE9 ba", "Th\u1EE9 t\u01B0", "Th\u1EE9 n\u0103m", "Th\u1EE9 s\341u", "Th\u1EE9 b\u1EA3y");
		this.HOUR    = new Array("110100101100", "001101001011", "110011010010", "101100110100", "001011001101", "010010110011");
		this.TIETKHI = new Array("Xu\u00E2n ph\u00E2n", "Thanh minh", "C\u1ED1c v\u0169", "L\u1EADp h\u1EA1", "Ti\u1EC3u m\u00E3n", "Mang ch\u1EE7ng",
			"H\u1EA1 ch\u00ED", "Ti\u1EC3u th\u1EED", "\u0110\u1EA1i th\u1EED", "L\u1EADp thu", "X\u1EED th\u1EED", "B\u1EA1ch l\u1ED9",
			"Thu ph\u00E2n", "H\u00E0n l\u1ED9", "S\u01B0\u01A1ng gi\u00E1ng", "L\u1EADp \u0111\u00F4ng", "Ti\u1EC3u tuy\u1EBFt", "\u0110\u1EA1i tuy\u1EBFt",
			"\u0110\u00F4ng ch\u00ED", "Ti\u1EC3u h\u00E0n", "\u0110\u1EA1i h\u00E0n", "L\u1EADp xu\u00E2n", "V\u0169 Th\u1EE7y", "Kinh tr\u1EADp"
		);
		this.PI         = Math.PI;
		this.DAYINWEEK   = new Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");
		this.element = '<div class="lunar-calendar"></div>';
		this.defaults = {
			elementStyle:1, // 1: list, 2:table
			getCalendar:'lunar-calendar-get-month',
			className:'lunar-calendar',
	        classItem :'lunar-calendar-item',
	        classNextMonth :'lunar-calendar-next-month',
	        classPrevMonth:'lunar-calendar-prev-month',
	        classNextYear:'lunar-calendar-next-year',
	        classPrevYear:'lunar-calendar-prev-year',
	        classMontName:'lunar-calendar-current-day',
	        prevMonthLink:' < ',
	        nextMonthLink:' > ',
	        prevYearLink:' << ',
	        nextYearLink:' >> ',
		};
	}
 
}( jQuery ));

