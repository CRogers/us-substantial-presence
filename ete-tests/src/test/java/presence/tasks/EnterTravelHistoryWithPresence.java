package presence.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.thucydides.core.annotations.Step;

public class EnterTravelHistoryWithPresence implements Task {
    private static final String TRAVEL_HISTORY_WITH_PRESENCE =
        "1\t\n" +
            "2014-09-12T11:55:54.0-04:00\n" +
            "JFK - JOHN F KENNEDY INTL\t\n" +
            "2016-09-16T00:00:00.0-04:00\n" +
            "NYC - NEW YORK CITY, NY";

    private final EntersTravelHistory enterTravelHistory = new EntersTravelHistory(TRAVEL_HISTORY_WITH_PRESENCE);

    @Override
    @Step("enter travel history that has presence")
    public <T extends Actor> void performAs(T actor) {
        enterTravelHistory.performAs(actor);
    }
}
