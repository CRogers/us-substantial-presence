package presence.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.annotations.Step;

public class EntersTravelHistory implements Task {
    private static final Target THE_TRAVEL_HISTORY_BOX = Target
        .the("Travel History Box")
        .locatedBy(".travel-history");

    private final String travelHistoryWithPresence;

    public EntersTravelHistory(String travelHistoryWithPresence) {
        this.travelHistoryWithPresence = travelHistoryWithPresence;
    }

    @Override
    @Step("Enters their travel history")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Enter
            .theValue(travelHistoryWithPresence)
            .into(THE_TRAVEL_HISTORY_BOX)
        );
    }
}
