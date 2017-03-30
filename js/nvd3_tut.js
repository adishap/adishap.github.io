var rawData = {
        "2016-12-30": 969.99,
        "2016-12-31": 959.54,
        "2017-01-01": 966.34,
        "2017-01-02": 997.75,
        "2017-01-03": 1011.44,
        "2017-01-04": 1035.51,
        "2017-01-05": 1004.73,
        "2017-01-06": 1114.38,
        "2017-01-07": 894.02,
        "2017-01-08": 906.2,
        "2017-01-09": 909.8,
        "2017-01-10": 896.09,
        "2017-01-11": 905.24,
        "2017-01-12": 778.7,
        "2017-01-13": 807.51,
        "2017-01-14": 825.98,
        "2017-01-15": 819.52,
        "2017-01-16": 821.86,
        "2017-01-17": 831.76,
        "2017-01-18": 905.95,
        "2017-01-19": 887.69,
        "2017-01-20": 902.23,
        "2017-01-21": 895.81,
        "2017-01-22": 921.98,
        "2017-01-23": 923.75,
        "2017-01-24": 913.15,
        "2017-01-25": 885.47,
        "2017-01-26": 893.25,
        "2017-01-27": 914.95,
        "2017-01-28": 918.02,
        "2017-01-29": 918.6,
        "2017-01-30": 913.12,
        "2017-01-31": 919.99,
        "2017-02-01": 963.99,
        "2017-02-02": 983.79,
        "2017-02-03": 1009.15,
        "2017-02-04": 1015.06,
        "2017-02-05": 1033.72,
        "2017-02-06": 1010.03,
        "2017-02-07": 1024,
        "2017-02-08": 1052.48,
        "2017-02-09": 1051.73,
        "2017-02-10": 985.71,
        "2017-02-11": 995.49,
        "2017-02-12": 1011.01,
        "2017-02-13": 1000.73,
        "2017-02-14": 1000.74,
        "2017-02-15": 1008.88,
        "2017-02-16": 1011.53,
        "2017-02-17": 1032.91,
        "2017-02-18": 1055.75,
        "2017-02-19": 1056.4,
        "2017-02-20": 1051.8
    },
    events = {
        "2017-01-06": "US goverment formally announces the electoral result.",
        "2017-01-20": " Inauguration of the 45th President Donald Trump",
        "2017-01-25": "Trump signing the executive order on banning immigration from seven terror-prone countries"
    };

function data() {
    var finalData = [];

    for (i in rawData) {
        finalData.push({ x: new Date(i), y: rawData[i] });
    }

    return [{
        values: finalData,
        key: 'bitcoin rate',
        color: '#ff7f0e'
    }];
}

function intialChart() {
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .useInteractiveGuideline(true);

        chart.xAxis.axisLabel("Date")
            .tickFormat(function(d) {
                return d3.time.format('%d/%m/%y')(new Date(d))
            });

        chart.yAxis
            .axisLabel('Bitcoin rates (in USD)')
            .tickFormat(d3.format('.02f'));

        d3.select('#chart svg')
            .datum(data())
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function drawVerticalLine(div, response, tooltipDiv, svg, xScale, left, y0, y1) {
    tooltipDiv.html('');
    for (date in response) {
        var p = $("<p>").attr('data-event-date', date),
            pHtml = "";
        for (var j = 0; j < response[date].length; j++) {
            pHtml += response[date][j];
        }
        p.html(pHtml);

        tooltipDiv.append(p);

        //draw a vertical line on graph
        svg.append("line")
            .style("stroke", "#0e8eff")
            .style("stroke-width", "2.5px")
            .attr("x1", xScale(new Date(date)) + left)
            .attr("y1", y0)
            .attr("x2", xScale(new Date(date)) + left)
            .attr("y2", y1)
            // addClass
            .attr('class', function(index, classNames) {
                return classNames + ' clickable vertical-line';
            })
            .attr('data-date', date);
    }

    div.on('mouseenter', '.vertical-line', function(event) {
        var y = event.pageY,
            x = event.pageX,
            event_date = $(this).attr('data-date');

        $('#hoverText .text-center p', div).hide();
        $("[data-event-date = '" + event_date + "']", div).show();
        $('#hoverText', div).show();

        $('#hoverText', div).css({
            position: 'absolute',
            left: x - 120,
            top: y - 60
        });
    });
}

function isNear($element, distance, event) {
    var left = $element.offset().left - distance,
        right = left + $element.width() + (2 * distance),
        x = event.pageX;

    return (x > left && x < right);
};

function hideHoverDiv(div) {
    var event_date;
    $('#hoverText p', div).each(function() {
        if ($(this).is(':visible')) {
            event_date = ($(this).data().eventDate);
        }
    });
    if (event_date !== undefined) {
        if (!isNear($("[data-date = '" + event_date + "']"), 80, event)) {
            div.find('#hoverText').hide();
        }
    }
}

function intermediateChart(chartId, chartParent) {
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .useInteractiveGuideline(true);
        chart.tooltip(false);

        chart.xAxis.axisLabel("Date")
            .tickFormat(function(d) {
                return d3.time.format('%d/%m/%y')(new Date(d))
            });

        chart.yAxis
            .axisLabel('Bitcoin rates (in USD)')
            .tickFormat(d3.format('.02f'));

        d3.select(chartId)
            .datum(data())
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        var tooltip = $('#hoverText .text-center', chartParent),
            xScale = chart.xAxis.scale(),
            //calculate the yScale
            yScale = chart.yAxis.scale(),
            left = chart.margin().left,
            top = chart.margin().top,
            svg = d3.select(chartId),
            y0 = yScale(chart.yAxis.domain()[0]) + top,
            y1 = yScale(chart.yAxis.domain()[1]) + top;

        drawVerticalLine(chartParent, events, tooltip, svg, xScale, left, y0, y1);
        return chart;
    });
}

intialChart();
intermediateChart("#intermediate_chart svg", $('.second_step'));
intermediateChart("#final_chart svg", $('.last_step'));

$('.last_step').on('mousemove', function(event) {
    hideHoverDiv($('.last_step'));
});
